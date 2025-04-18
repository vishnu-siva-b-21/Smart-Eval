from flask import (
    Blueprint,
    jsonify,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session,
)
from benx_1.dl_models import (
    predict_sbert,
    predict_t5_transformer,
    evaluate_mark,
)
from benx_1.models import dbs
import bson

student = Blueprint("student", __name__)


@student.route("/login-student", methods=["POST"])
def login_student():
    if request.method == "POST":
        register_number = request.form.get("registerNumber")
        password = request.form.get("stu_password")

        student_login_data = dbs["student_login_details"].find_one(
            {"register_number": register_number}
        )

        if student_login_data:
            if student_login_data.get("password") == password:
                session["student_register_number"] = register_number
                flash("Login successful", category="success")
                return redirect(url_for("student.student_dashboard"))
            else:
                flash("Invalid password. Please try again.", category="error")
                return redirect(url_for("main.home"))
        else:
            flash("UserName Not Found. Please try again.", category="error")
            return redirect(url_for("main.home"))
    else:
        return redirect(url_for("main.home"))


@student.route("/student-logout")
def student_logout():
    session.pop("student_register_number", None)
    flash("You have been logged out", category="success")
    return redirect(url_for("main.home"))


@student.route("/student-dashboard", methods=["POST", "GET"])
def student_dashboard():
    if "student_register_number" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))

    register_number = session["student_register_number"]
    student_data = dbs["student_details"].find_one({"register_number": register_number})
    if not student_data:
        flash("Student details not found", category="error")
        return redirect(url_for("main.home"))
    exam = (
        dbs["ongoing_exam"].find_one(
            {"allowed_sec": student_data["section"]},
            {"exam_id": 1, "exam_title": 1, "faculty_email": 1},
        )
        or {}
    )
    is_exam, exam_title, faculty_email = (
        (1, exam["exam_title"], exam["faculty_email"]) if exam else (0, "", "")
    )
    faculty_name = (
        dict(dbs["faculty_details"].find_one({"email": faculty_email})).get("name")
        if faculty_email
        else ""
    )
    already_attended = (
        1
        if dbs["exam_response"].find_one(
            {
                "student_register_number": session["student_register_number"],
                "exam_id": bson.ObjectId(exam.get("exam_id")),
            }
        )
        else 0
    )
    return render_template(
        "student/student_dashboard.html",
        is_exam=is_exam,
        already_attended=already_attended,
        student_info=student_data,
        exam_title=exam_title,
        faculty_name=faculty_name,
    )


@student.route("/exam-instruction", methods=["POST"])
def exam_instruction():
    if "student_register_number" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    section = dict(
        dbs["student_details"].find_one(
            {"register_number": session["student_register_number"]}
        )
    ).get("section")
    data = dbs["ongoing_exam"].find_one({"allowed_sec": section}, {"exam_id": 1})
    if not (data):
        flash("Your currently dont have any exam", category="error")
        return redirect(url_for("student.student_dashboard"))
    else:
        if dbs["exam_response"].find_one(
            {
                "student_register_number": session["student_register_number"],
                "exam_id": data["exam_id"],
            }
        ):
            flash(
                f"Student with the register number {session['student_register_number']} has already attended the exam",
                category="error",
            )
            return redirect(url_for("student.student_dashboard"))
    return render_template("student/exam_instruction.html")


@student.route("/exam", methods=["GET"])
def exam():
    if "student_register_number" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    section = dict(
        dbs["student_details"].find_one(
            {"register_number": session["student_register_number"]}
        )
    ).get("section")
    data = dbs["ongoing_exam"].find_one({"allowed_sec": section}, {"exam_id": 1})
    if not (data):
        flash(
            "Your exam has been already ended your answers will not be submited contact the faculty for re-exam",
            category="error",
        )
        return redirect(url_for("student.student_dashboard"))
    referrer = request.referrer
    if referrer and referrer.endswith("/exam-instruction"):
        if dbs["exam_response"].find_one(
            {
                "student_register_number": session["student_register_number"],
                "exam_id": data["exam_id"],
            }
        ):
            flash(
                f"Student with the register number {session['student_register_number']} has already attended the exam",
                category="error",
            )
            return redirect(url_for("student.student_dashboard"))
        return render_template("student/exam.html")
    else:
        return redirect(url_for("student.exam_instruction"))


@student.route("/questions")
def get_questions():
    if "student_register_number" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    else:
        section = dict(
            dbs["student_details"].find_one(
                {"register_number": session["student_register_number"]}
            )
        ).get("section")
        if not (dbs["ongoing_exam"].find_one({"allowed_sec": section}, {"_id": 1})):
            flash(
                "Your exam has been already ended your answers will not be submited contact the faculty for re-exam",
                category="error",
            )
            return redirect(url_for("student.student_dashboard"))
        student_section = dict(
            dbs["student_details"].find_one(
                {"register_number": session.get("student_register_number")},
                {"section": 1, "_id": 0},
            )
        ).get("section")
        if not student_section:
            return jsonify({"error": "Student details not found"}), 404
        questions_data = dbs["ongoing_exam"].find_one(
            {"allowed_sec": student_section}, {"_id": 0, "qp": 1, "exam_title": 1}
        )
        exam_title = questions_data["exam_title"]
        grammar_correction = questions_data.get("grammar_correction", True)

        questions = []
        for question in questions_data.get("qp"):
            questions.append(
                {
                    "_id": str(question["_id"]),
                    "question": question["question"],
                    "type": question["type"],
                }
            )
        return jsonify(
            {
                "questions_data": questions,
                "exam_title": exam_title,
                "grammar_correction": grammar_correction,
            }
        )


@student.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    if "student_register_number" not in session:
        return jsonify({"error": "You need to login first"}), 401
    else:
        section = dict(
            dbs["student_details"].find_one(
                {"register_number": session["student_register_number"]}
            )
        ).get("section")
        if not (dbs["ongoing_exam"].find_one({"allowed_sec": section}, {"_id": 1})):
            return (
                jsonify(
                    {
                        "error": "Your exam has been already ended your answers will not be submited contact the faculty for re-exam"
                    }
                ),
                504,
            )
        data = request.json
        print(data)
        exam_title = data.get("exam_title")
        grammar_correction = data.get("grammar_correction", True)
        student_answers = data.get("questions", [])
        result = []
        total_exam_mark = 0

        for student_answer in student_answers:
            student_question_id = student_answer.get("_id")
            student_answer_text = (
                student_answer.get("answer")
                if student_answer.get("answer") != ""
                else None
            )
            student_question_id = bson.ObjectId(student_question_id)
            student_section = dbs["student_details"].find_one(
                {"register_number": session.get("student_register_number")},
                {"section": 1, "_id": 0},
            )
            student_section = student_section["section"]
            answers = list(
                dbs["ongoing_exam"].find(
                    {"allowed_sec": student_section},
                    {"_id": 0, "qp": 1, "faculty_email": 1, "exam_id": 1},
                )
            )
            if not answers:
                return (
                    jsonify({"error": "Questions not found for student's section"}),
                    404,
                )
            questions = []
            for question_set in answers:
                for question in question_set["qp"]:
                    questions.append(
                        {
                            "_id": str(question["_id"]),
                            "question": question["question"],
                            "type": question["type"],
                            "correct_answer": question["correct_answer"],
                            "marks": question["marks"],
                        }
                    )
            correct_answer = next(
                (q for q in questions if q["_id"] == str(student_question_id)), None
            )
            if not correct_answer:
                return (
                    jsonify({"error": "Correct answer not found for the question"}),
                    404,
                )

            if student_answer_text:
                m = (
                    predict_t5_transformer(student_answer_text)
                    if grammar_correction
                    else student_answer_text
                )

                mark = evaluate_mark(
                    predict_sbert(
                        m,
                        correct_answer["correct_answer"],
                    ),
                    float(correct_answer["marks"]),
                )
            else:
                mark = 0

            total_exam_mark += float(correct_answer["marks"])

            result.append(
                {
                    "_id": str(student_question_id),
                    "question": correct_answer["question"],
                    "student_answer": (
                        student_answer_text if student_answer_text else "NA"
                    ),
                    "t5_student_answer": (m if m else "NA"),
                    "correct_answer": correct_answer["correct_answer"],
                    "student_ques_mark": mark,
                    "total_ques_mark": correct_answer["marks"],
                }
            )
        end_response = {
            "student_register_number": session["student_register_number"],
            "exam_title": exam_title,
            "response": result,
            "total_exam_mark": total_exam_mark,
            "student_section": student_section,
            "faculty_email": answers[0]["faculty_email"],
            "exam_id": answers[0]["exam_id"],
        }
        dbs["exam_response"].insert_one(end_response)
        return jsonify({"message": "received"}), 200
