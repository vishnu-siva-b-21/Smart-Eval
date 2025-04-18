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
from benx_1.models import dbs
import bson

faculty = Blueprint("faculty", __name__)


@faculty.route("/login-faculty", methods=["POST"])
def login_faculty():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("fal_password")
        faculty_login_data = dbs["faculty_login_details"].find_one({"email": email})
        if faculty_login_data:
            if faculty_login_data.get("password") == password:
                session["faculty_email"] = email
                flash("Login successful", category="success")
                return redirect(url_for("faculty.faculty_dashboard"))
            else:
                flash("Invalid password. Please try again.", category="error")
                return redirect(url_for("main.home"))
        else:
            flash("Email not found. Please try again.", category="error")
            return redirect(url_for("main.home"))
    else:
        return redirect(url_for("main.home"))


@faculty.route("/faculty-logout")
def faculty_logout():
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    session.pop("faculty_email", None)
    flash("You have been logged out", category="success")
    return redirect(url_for("main.home"))


@faculty.route("/change-password", methods=["POST"])
def change_password():
    if request.method == "POST":
        if "faculty_email" not in session:
            return jsonify({"error": "User not logged in"}), 401
        current_password = request.json.get("currentPassword")
        new_password = request.json.get("newPassword")
        email = session["faculty_email"]
        faculty_login_data = dbs["faculty_login_details"].find_one({"email": email})
        if (
            not faculty_login_data
            or faculty_login_data.get("password") != current_password
        ):
            return jsonify({"error": "Incorrect current password"}), 403
        dbs["faculty_login_details"].update_one(
            {"email": email}, {"$set": {"password": new_password}}
        )
        return jsonify({"message": "Password changed successfully"}), 200
    else:
        return jsonify({"error": "improper way"}), 401


@faculty.route("/faculty-dashboard", methods=["POST", "GET"])
def faculty_dashboard():
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    email = session["faculty_email"]
    faculty_login_data = dbs["faculty_login_details"].find_one(
        {"email": email}, {"password": 1, "_id": 0}
    )
    faculty_data = dbs["faculty_details"].find_one({"email": email}, {"_id": 0})
    if not faculty_login_data:
        flash("Faculty login details not found", category="error")
        return redirect(url_for("main.home"))
    if not faculty_data:
        flash("Faculty details not found", category="error")
        return redirect(url_for("main.home"))
    faculty_data.update(faculty_login_data)
    return render_template("faculty/faculty_dashboard.html", faculty_info=faculty_data)


@faculty.route("/exam-desc", methods=["GET", "POST"])
def exam_desc():
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    return render_template("faculty/exam_desc.html")


@faculty.route("/create-ques", methods=["POST"])
def create_ques():
    if request.method == "POST":
        if "faculty_email" not in session:
            flash("You need to login first", category="error")
            return redirect(url_for("main.home"))
        print("Received form data:", request.form)
        exam_title = request.form.get("title_count")
        print("request fill", request.form.get("fill_count"))
        print("request sh", request.form.get("shortans_count"))
        fill_count = int(request.form.get("fill_count"))
        shortans_count = int(request.form.get("shortans_count"))
        print("fill", fill_count)
        print("sh", shortans_count)
        sec = request.form.getlist("sec")

        if list(
            dbs["exam_qps"].find(
                {"exam_title": exam_title, "faculty_email": session["faculty_email"]}
            )
        ):
            flash("The exam title is used", category="error")
            return redirect(url_for("faculty.exam_desc"))
        else:
            session[f"{exam_title}_sec"] = sec
            return render_template(
                "faculty/create_ques.html",
                fill_count=fill_count,
                shortans_count=shortans_count,
                exam_title=exam_title,
            )

    return redirect(url_for("faculty.exam_desc"))


@faculty.route("/create_qp", methods=["POST"])
def create_qp():
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    data = dict(request.json)
    for ques in data["qp"]:
        ques["_id"] = bson.ObjectId()
    data["faculty_email"] = session["faculty_email"]
    exam_title = data.get("exam_title")
    data["allowed_sec"] = session[f"{exam_title}_sec"]
    session.pop(f"{exam_title}_sec", None)
    existing_exam = dbs["exam_qps"].find_one(
        {"exam_title": exam_title, "faculty_email": session["faculty_email"]}
    )
    if existing_exam:
        flash("The exam title is already used", category="error")
        return redirect(url_for("faculty.exam_desc"))
    for i in data["qp"]:
        if i["type"] == "fill_up":
            i["marks"] = "1"
        elif i["type"] == "short_ans":
            i["marks"] = "2"
    dbs["exam_qps"].insert_one(data)
    return jsonify({"message": "Qp creation successful"})


@faculty.route("/exam-list", methods=["GET", "POST"])
def exam_list():
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    data = list(dbs["exam_qps"].find({"faculty_email": session["faculty_email"]}))
    you_started_exams = list(
        dbs["ongoing_exam"].find({"faculty_email": session["faculty_email"]})
    )
    you_started_exam_ids = {exam["exam_id"] for exam in you_started_exams}
    you_started_exam_sec = {exam["allowed_sec"] for exam in you_started_exams}

    other_started_exams = list(
        dbs["ongoing_exam"].find({"faculty_email": {"$ne": session["faculty_email"]}})
    )
    other_started_exam_sec = {exam["allowed_sec"] for exam in other_started_exams}

    table_data = [
        {
            "sec": sec,
            "exam_title": exam["exam_title"],
            "faculty_email": exam["faculty_email"],
            "exam_id": exam["_id"],
            "you_started": (
                1
                if exam["_id"] in you_started_exam_ids and sec in you_started_exam_sec
                else 0
            ),
            "other_started": 1 if sec in other_started_exam_sec else 0,
            "you_already_started": 1 if sec in you_started_exam_sec else 0,
        }
        for exam in data
        for sec in exam["allowed_sec"]
    ]
    return render_template("faculty/exam_list.html", table_data=table_data)


@faculty.route("/exam-qp/<sec>-<exam_id>", methods=["GET", "POST"])
def exam_qp(exam_id, sec):
    exam_id = bson.ObjectId(exam_id)
    data = dbs["exam_qps"].find_one(
        {"_id": exam_id, "faculty_email": session["faculty_email"]}, {"_id": 0}
    )
    return render_template("faculty/exam_qp.html", sec=sec, data=data)


@faculty.route("/details/<sec>-<exam_id>", methods=["POST"])
def exam_details(exam_id, sec):
    if request.method == "POST":
        if "faculty_email" not in session:
            flash("You need to login first", category="error")
            return redirect(url_for("main.home"))
        exam_id = bson.ObjectId(exam_id)
        exam_title = (
            dbs["exam_qps"]
            .find_one(
                {"_id": exam_id, "faculty_email": session["faculty_email"]},
                {"exam_title": 1, "_id": 0},
            )
            .get("exam_title")
        )

        responses = list(
            dbs["exam_response"].find(
                {
                    "exam_title": exam_title,
                    "faculty_email": session["faculty_email"],
                    "student_section": sec,
                },
                {
                    "student_register_number": 1,
                    "_id": 0,
                    "response": 1,
                    "total_exam_mark": 1,
                },
            )
        )
        data = []
        for result in responses:
            total_student_mark = 0
            for question in result.get("response"):
                total_student_mark += question.get("student_ques_mark")
            student_details = dbs["student_details"].find_one(
                {"register_number": result.get("student_register_number")},
                {"_id": 0, "name": 1, "section": 1},
            )
            student_name = student_details["name"]
            student_section = student_details["section"]
            data.append(
                {
                    "reg_no": result.get("student_register_number"),
                    "name": student_name,
                    "section": student_section,
                    "mark": f"{round(total_student_mark,2)}/{result.get('total_exam_mark')}",
                }
            )
        return render_template(
            "faculty/exam_present.html",
            table_data=data,
            exam_title=exam_title,
            exam_id=exam_id,
            sec=sec,
        )


@faculty.route("/response/<reg_no>-<exam_id>", methods=["GET", "POST"])
def response_details(reg_no, exam_id):
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    exam_id = bson.ObjectId(exam_id)
    data = dbs["exam_response"].find_one(
        {"student_register_number": reg_no, "exam_id": exam_id}, {"_id": 0}
    )
    student_details = dbs["student_details"].find_one(
        {"register_number": reg_no}, {"_id": 0}
    )
    if data.get("faculty_email") == session["faculty_email"]:
        return render_template(
            "faculty/response_details.html", data=data, student_data=student_details
        )
    flash("You are not authorized!", category="error")
    return redirect(url_for("main.home"))


@faculty.route("/update-mark/<reg_no>-<exam_id>-<question_id>", methods=["POST"])
def update_mark(reg_no, exam_id, question_id):
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    new_mark = request.form.get("new_mark")
    exam_id = bson.ObjectId(exam_id)
    dbs["exam_response"].update_one(
        {
            "student_register_number": reg_no,
            "exam_id": exam_id,
            "response._id": question_id,
        },
        {"$set": {"response.$.student_ques_mark": float(new_mark)}},
    )
    flash("Mark updated successfully", category="success")
    return redirect(url_for("faculty.response_details", reg_no=reg_no, exam_id=exam_id))


@faculty.route("/start/<sec>-<exam_id>", methods=["POST"])
def exam_start(exam_id, sec):
    if request.method == "POST":
        if "faculty_email" not in session:
            flash("You need to login first", category="error")
            return redirect(url_for("main.home"))
        exam_id = bson.ObjectId(exam_id)
        if dbs["ongoing_exam"].find_one({"allowed_sec": sec}):
            flash("An exam is going for the section!", category="error")
        else:
            exam_qp = dbs["exam_qps"].find_one(
                {"_id": exam_id, "faculty_email": session["faculty_email"]}
            )
            exam_qp["allowed_sec"] = sec
            exam_qp["exam_id"] = exam_qp.pop("_id")
            dbs["ongoing_exam"].insert_one(exam_qp)
        return redirect(url_for("faculty.exam_list"))


@faculty.route("/stop/<sec>-<exam_id>", methods=["POST"])
def exam_stop(exam_id, sec):
    if request.method == "POST":
        if "faculty_email" not in session:
            flash("You need to login first", category="error")
            return redirect(url_for("main.home"))
        exam_id = bson.ObjectId(exam_id)
        if not dbs["ongoing_exam"].find_one(
            {
                "exam_id": exam_id,
                "allowed_sec": sec,
                "faculty_email": session["faculty_email"],
            }
        ):
            flash("The selected exam is not started yet!", category="error")
        else:
            dbs["ongoing_exam"].delete_one(
                {
                    "exam_id": exam_id,
                    "allowed_sec": sec,
                    "faculty_email": session["faculty_email"],
                }
            )
        return redirect(url_for("faculty.exam_list"))


@faculty.route("/del/<sec>-<exam_id>", methods=["POST"])
def exam_del(exam_id, sec):
    if request.method == "POST":
        if "faculty_email" not in session:
            flash("You need to login first", category="error")
            return redirect(url_for("main.home"))
        exam_id = bson.ObjectId(exam_id)
        if dbs["exam_qps"].find(
            {
                "_id": exam_id,
                "allowed_sec": {"$in": [sec]},
                "faculty_email": session["faculty_email"],
            }
        ):
            if dbs["ongoing_exam"].find_one(
                {
                    "exam_id": exam_id,
                    "allowed_sec": sec,
                    "faculty_email": session["faculty_email"],
                }
            ):
                flash(
                    "The selected exam is ongoing please stop it before deleting!",
                    category="error",
                )
                return redirect(url_for("faculty.exam_list"))
            else:
                db = dbs["exam_qps"].find_one(
                    {
                        "_id": exam_id,
                        "allowed_sec": {"$in": [sec]},
                        "faculty_email": session["faculty_email"],
                    }
                )
                if len(db["allowed_sec"]) > 1:
                    dbs["exam_qps"].update_one(
                        {
                            "_id": exam_id,
                            "allowed_sec": {"$in": [sec]},
                            "faculty_email": session["faculty_email"],
                        },
                        {"$pull": {"allowed_sec": sec}},
                    )
                else:
                    dbs["exam_qps"].delete_one(db)
                return redirect(url_for("faculty.exam_list"))
        else:
            flash("Exam id not found retry", category="error")
            return redirect(url_for("faculty.exam_list"))


@faculty.route("/abs/<sec>-<exam_id>-<exam_title>", methods=["POST"])
def abs(exam_title, exam_id, sec):
    if "faculty_email" not in session:
        flash("You need to login first", category="error")
        return redirect(url_for("main.home"))
    exam_id = bson.ObjectId(exam_id)

    responses = list(
        dbs["exam_response"].find(
            {
                "exam_title": exam_title,
                "faculty_email": session["faculty_email"],
                "student_section": sec,
            },
            {"student_register_number": 1, "_id": 0},
        )
    )

    pre_students = [response.get("student_register_number") for response in responses]

    allowed_students = list(
        dbs["student_details"].find({"section": sec}, {"register_number": 1, "_id": 0})
    )
    tot_stu = [student.get("register_number") for student in allowed_students]

    abs_students = list(set(tot_stu) - set(pre_students))

    data = list(
        dbs["student_details"].find(
            {"register_number": {"$in": abs_students}},
            {"register_number": 1, "_id": 0, "name": 1, "section": 1},
        )
    )

    return render_template(
        "faculty/exam_absent.html", table_data=data, exam_title=exam_title
    )
