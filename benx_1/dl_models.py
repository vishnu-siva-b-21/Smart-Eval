import os
from benx_1.config import Config
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM



def predict_t5_transformer(input_string):
    tokenizer = AutoTokenizer.from_pretrained(Config.T5_MODEL, token=Config.HF_TOKEN)
    model = AutoModelForSeq2SeqLM.from_pretrained(Config.T5_MODEL, token=Config.HF_TOKEN)
    input_text = f"grammar: {input_string}"
    inputs = tokenizer(
        input_text, return_tensors="pt", padding=True, truncation=True, max_length=128
    )
    outputs = model.generate(**inputs, max_length=128, num_beams=4, early_stopping=True)
    corrected_sentence = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return corrected_sentence


def predict_sbert(text1, text2):
    model = SentenceTransformer(Config.SBERT_MODEL, token=Config.HF_TOKEN)
    embedding1 = model.encode(text1)
    embedding2 = model.encode(text2)
    similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
    similarity_score = (similarity_score + 1) / 2  # Scale to 0-1 range
    return round(similarity_score, 3)


# def evaluate_mark(similarity_score, total_mark):
#     thresholds = [0.8, 0.6, 0.4, 0.2]
#     marks = [total_mark, total_mark * 0.75, total_mark * 0.5, total_mark * 0.25, 0]
#     for i, threshold in enumerate(thresholds):
#         if similarity_score >= threshold:
#             return marks[i]
#     return 0


def evaluate_mark(similarity_score, total_mark):
    return round(similarity_score * total_mark, 1)

if __name__ == "__main__":
    mark = evaluate_mark(
        predict_sbert(
            predict_t5_transformer("Machine Learng is base on Intlegnce "),
            "Machine Learning is based on Artificial Intellegence",
        ),
        float(6),
    )
    print(f"{mark}/{float(6)}")
    print(predict_t5_transformer("Machine Learng is base on Intlegnce "))
    print(
        predict_sbert(
            predict_t5_transformer("Machine Learng is base on Intlegnce "),
            "Machine Learning is based on Artificial Intellegence",
        )
    )
