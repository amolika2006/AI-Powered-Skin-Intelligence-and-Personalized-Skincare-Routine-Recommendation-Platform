import os
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_FILE = os.path.join(BASE_DIR, "skin_concern_model.pkl")
ENCODER_FILE = os.path.join(BASE_DIR, "skin_concern_encoder.pkl")


# Sample training data
# Features:
# acne, dryness, oiliness, redness, pigmentation, sensitivity
#
# 0 = None
# 1 = Mild
# 2 = Moderate
# 3 = Severe

X = [
    [3, 0, 3, 0, 0, 0],
    [2, 0, 2, 0, 0, 0],
    [0, 3, 0, 0, 1, 2],
    [0, 2, 0, 0, 1, 1],
    [0, 0, 3, 1, 0, 0],
    [0, 0, 2, 1, 0, 0],
    [0, 0, 0, 3, 2, 2],
    [0, 0, 0, 2, 2, 1],
    [0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 3],
    [0, 1, 0, 0, 0, 3],
]

y = [
    "Acne",
    "Acne",
    "Dryness",
    "Dryness",
    "Oiliness",
    "Oiliness",
    "Redness",
    "Redness",
    "Pigmentation",
    "Pigmentation",
    "Sensitivity",
    "Sensitivity",
]


def train_model():

    encoder = LabelEncoder()

    y_encoded = encoder.fit_transform(y)

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42
    )

    model.fit(X, y_encoded)

    joblib.dump(model, MODEL_FILE)
    joblib.dump(encoder, ENCODER_FILE)

    return model, encoder


def load_model():

    if not os.path.exists(MODEL_FILE) or not os.path.exists(ENCODER_FILE):
        return train_model()

    model = joblib.load(MODEL_FILE)
    encoder = joblib.load(ENCODER_FILE)

    return model, encoder


def predict_skin_concern(
    acne,
    dryness,
    oiliness,
    redness,
    pigmentation,
    sensitivity
):

    model, encoder = load_model()

    features = [[
        acne,
        dryness,
        oiliness,
        redness,
        pigmentation,
        sensitivity
    ]]

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    predicted_concern = encoder.inverse_transform(
        [prediction]
    )[0]

    confidence = max(probabilities) * 100

    return {
        "predicted_concern": predicted_concern,
        "confidence": round(confidence, 2)
    }