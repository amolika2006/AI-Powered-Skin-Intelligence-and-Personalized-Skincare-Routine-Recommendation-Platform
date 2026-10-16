import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from pwdlib import PasswordHash
from ai_model import predict_skin_concern

# Load the .env file located in the Backend folder
load_dotenv(Path(__file__).resolve().parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-powered-skin-intelligence-and-pe.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
password_hash = PasswordHash.recommended()

# PostgreSQL connection
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),
    database=os.getenv("DB_NAME", "skin_intelligence"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT", "5432"),
)



# Registration data
class RegisterData(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"

class GuidanceData(BaseModel):
    user_id: int
    guidance: str

class ConsultationData(BaseModel):
    user_id: int
    consultant_id: int
    consultation_date: str
    notes: str = ""

# Login data
class LoginData(BaseModel):
    email: str
    password: str
    role: str = "user"


# Skin profile data
class SkinProfileData(BaseModel):
    user_id: int
    skin_type: str
    age_group: str
    concerns: str = ""
    allergies: str = ""
    sensitivities: str = ""

class IngredientData(BaseModel):
    name: str
    category: str = ""
    description: str = ""
    benefits: str = ""
    suitable_skin_types: str = ""
    target_concerns: str = ""
    warnings: str = ""

class ProgressData(BaseModel):
    user_id: int
    skin_health_score: int
    acne_level: str = ""
    dryness_level: str = ""
    oiliness_level: str = ""
    redness_level: str = ""
    pigmentation_level: str = ""
    sensitivity_level: str = ""
    routine_adherence: int = 0
    notes: str = ""


@app.get("/")
def home():
    return {"message": "AI Skin Intelligence Backend is running"}


@app.get("/test-db")
def test_database():
    cursor = conn.cursor()

    cursor.execute("SELECT current_database();")

    database_name = cursor.fetchone()[0]

    cursor.close()

    return {
        "message": "Database connected successfully",
        "database": database_name
    }


@app.post("/register")
def register_user(data: RegisterData):

    hashed_password = password_hash.hash(data.password)

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO users (name, email, password, role)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
        """,
        (
            data.name,
            data.email,
            hashed_password,
            data.role
        )
    )

    user_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()

    return {
        "message": "Registration successful",
        "user_id": user_id
    }

@app.post("/login")
def login_user(data: LoginData):

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id, password, role
            FROM users
            WHERE email = %s;
            """,
            (data.email,)
        )

        user = cursor.fetchone()

        cursor.close()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        user_id, stored_password, stored_role = user

        if not password_hash.verify(
            data.password,
            stored_password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if stored_role != data.role:
            raise HTTPException(
                status_code=403,
                detail="Selected role does not match your account"
            )

        return {
            "message": "Login successful",
            "user_id": user_id,
            "role": stored_role
        }

    except HTTPException:
        raise

    except Exception as error:
        print("LOGIN ERROR:", error)
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Login server error. Check backend terminal."
        )

@app.post("/skin-profile")
def save_skin_profile(data: SkinProfileData):
    cursor = conn.cursor()

    try:
        # Reset any previously failed transaction
        conn.rollback()

        cursor.execute(
            """
            INSERT INTO skin_profiles
            (user_id, skin_type, age_group, concerns, allergies, sensitivities)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                data.user_id,
                data.skin_type,
                data.age_group,
                data.concerns,
                data.allergies,
                data.sensitivities,
            ),
        )

        profile_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "message": "Skin profile saved successfully",
            "profile_id": profile_id,
        }

    except Exception as e:
        conn.rollback()
        print("SKIN PROFILE SQL ERROR:", repr(e))
        raise

    finally:
        cursor.close()


@app.get("/skin-profile/{user_id}")
def get_skin_profile(user_id: int):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT skin_type, age_group, concerns, allergies, sensitivities
            FROM skin_profiles
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (user_id,)
        )

        profile = cursor.fetchone()
        cursor.close()

        if not profile:
            return {
                "message": "Skin profile not found"
            }

        return {
            "skin_type": profile[0],
            "age_group": profile[1],
            "concerns": profile[2],
            "allergies": profile[3],
            "sensitivities": profile[4]
        }

    except Exception as e:
        return {
            "error": str(e)
        }


    # Lifestyle tracking data
class LifestyleData(BaseModel):
    user_id: int
    water_intake: str = ""
    exercise: str = ""
    diet: str = ""
    smoking: str = ""
    alcohol: str = ""
    sunscreen: str = ""


@app.post("/lifestyle")
def save_lifestyle(data: LifestyleData):
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO lifestyle_tracking
        (user_id, water_intake, exercise, diet, smoking, alcohol, sunscreen)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (
            data.user_id,
            data.water_intake,
            data.exercise,
            data.diet,
            data.smoking,
            data.alcohol,
            data.sunscreen
        )
    )

    lifestyle_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()

    return {
        "message": "Lifestyle data saved successfully",
        "lifestyle_id": lifestyle_id
    }


@app.get("/lifestyle/{user_id}")
def get_lifestyle(user_id: int):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT water_intake, exercise, diet, smoking, alcohol, sunscreen
            FROM lifestyle_tracking
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (user_id,)
        )

        lifestyle = cursor.fetchone()
        cursor.close()

        if not lifestyle:
            return {
                "message": "Lifestyle data not found"
            }

        return {
            "water_intake": lifestyle[0],
            "exercise": lifestyle[1],
            "diet": lifestyle[2],
            "smoking": lifestyle[3],
            "alcohol": lifestyle[4],
            "sunscreen": lifestyle[5]
        }

    except Exception as e:
        return {
            "error": str(e)
        }

# Sleep tracking data
class SleepData(BaseModel):
    user_id: int
    sleep_time: str = ""
    wake_time: str = ""
    duration: str = ""
    quality: str = ""
    interruptions: str = ""


@app.post("/sleep")
def save_sleep(data: SleepData):
    cursor = conn.cursor()

    try:
        conn.rollback()

        cursor.execute(
            """
            INSERT INTO public.sleep_tracking
            (user_id, sleep_time, wake_time, duration, quality, interruptions)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (
                data.user_id,
                data.sleep_time,
                data.wake_time,
                data.duration,
                data.quality,
                data.interruptions,
            ),
        )

        sleep_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "message": "Sleep information saved successfully",
            "sleep_id": sleep_id,
        }

    except Exception as e:
        conn.rollback()
        print("SLEEP SQL ERROR:", repr(e))
        raise

    finally:
        cursor.close()


@app.get("/skin-profile/{user_id}")
def get_skin_profile(user_id: int):
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT skin_type, age_group, concerns, allergies, sensitivities
            FROM public.skin_profiles
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1;
            """,
            (user_id,)
        )

        profile = cursor.fetchone()

        if not profile:
            return {"message": "Skin profile not found"}

        return {
            "skin_type": profile[0],
            "age_group": profile[1],
            "concerns": profile[2],
            "allergies": profile[3],
            "sensitivities": profile[4]
        }

    except Exception as e:
        conn.rollback()
        print("GET SKIN PROFILE ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve skin profile"
        )

    finally:
        cursor.close()

# Hydration tracking data
class HydrationData(BaseModel):
    user_id: int
    water_intake: str = ""
    glasses: str = ""
    goal: str = ""


@app.post("/hydration")
def save_hydration(data: HydrationData):
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO hydration_tracking
        (user_id, water_intake, glasses, goal)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
        """,
        (
            data.user_id,
            data.water_intake,
            data.glasses,
            data.goal
        )
    )

    hydration_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()

    return {
        "message": "Hydration data saved successfully",
        "hydration_id": hydration_id
    }
class SkinAssessmentData(BaseModel):
    user_id: int
    acne: str
    dryness: str
    oiliness: str
    redness: str
    pigmentation: str
    sensitivity: str
    score: int
    result: str


@app.post("/skin-assessment")
def save_skin_assessment(data: SkinAssessmentData):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO skin_assessments
            (
                user_id,
                acne,
                dryness,
                oiliness,
                redness,
                pigmentation,
                sensitivity,
                score,
                result
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                data.user_id,
                data.acne,
                data.dryness,
                data.oiliness,
                data.redness,
                data.pigmentation,
                data.sensitivity,
                data.score,
                data.result
            )
        )

        assessment_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()

        return {
            "message": "Skin assessment saved successfully",
            "assessment_id": assessment_id
        }

    except Exception as e:
        return {
            "error": str(e)
        }

@app.get("/ingredients")
def get_ingredients():
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, category, description, benefits,
                   suitable_skin_types, target_concerns, warnings
            FROM ingredients
            ORDER BY name;
        """)

        rows = cursor.fetchall()
        cursor.close()

        ingredients = []

        for row in rows:
            ingredients.append({
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "description": row[3],
                "benefits": row[4],
                "suitable_skin_types": row[5],
                "target_concerns": row[6],
                "warnings": row[7]
            })

        return ingredients

    except Exception as e:
        return {
            "error": str(e)
        }


@app.get("/ingredient/{ingredient_name}")
def get_ingredient(ingredient_name: str):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, category, description, benefits,
                   suitable_skin_types, target_concerns, warnings
            FROM ingredients
            WHERE LOWER(TRIM(name)) = LOWER(TRIM(%s))
            LIMIT 1;
        """, (ingredient_name,))

        ingredient = cursor.fetchone()
        cursor.close()

        if ingredient is None:
            raise HTTPException(
                status_code=404,
                detail="Ingredient not found"
            )

        return {
            "id": ingredient[0],
            "name": ingredient[1],
            "category": ingredient[2],
            "description": ingredient[3],
            "benefits": ingredient[4],
            "suitable_skin_types": ingredient[5],
            "target_concerns": ingredient[6],
            "warnings": ingredient[7]
        }

    except HTTPException:
        raise

    except Exception as e:
        print("INGREDIENT ERROR:", e)
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Ingredient server error"
        )
@app.get("/ingredient-assessment/{user_id}/{ingredient_name}")
def assess_ingredient(user_id: int, ingredient_name: str):

    try:
        cursor = conn.cursor()

        # ---------------------------------------
        # 1. Get user's latest skin profile
        # ---------------------------------------

        cursor.execute("""
            SELECT
                skin_type,
                concerns,
                allergies,
                sensitivities
            FROM skin_profiles
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1;
        """, (user_id,))

        profile = cursor.fetchone()

        if not profile:
            cursor.close()

            raise HTTPException(
                status_code=404,
                detail="Skin profile not found. Please complete your skin profile first."
            )

        skin_type = profile[0] or ""
        concerns = profile[1] or ""
        allergies = profile[2] or ""
        sensitivities = profile[3] or ""

        # ---------------------------------------
        # 2. Get ingredient information
        # ---------------------------------------

        cursor.execute("""
            SELECT
                name,
                suitable_skin_types,
                target_concerns,
                warnings
            FROM ingredients
            WHERE LOWER(TRIM(name)) = LOWER(TRIM(%s))
            LIMIT 1;
        """, (ingredient_name,))

        ingredient = cursor.fetchone()

        if not ingredient:
            cursor.close()

            raise HTTPException(
                status_code=404,
                detail="Ingredient not found"
            )

        ingredient_name_db = ingredient[0]
        suitable_skin_types = ingredient[1] or ""
        target_concerns = ingredient[2] or ""
        warnings = ingredient[3] or ""

        cursor.close()

        # ---------------------------------------
        # 3. Normalize values
        # ---------------------------------------

        skin_type_lower = skin_type.strip().lower()

        suitable_types = [
            item.strip().lower()
            for item in suitable_skin_types.split(",")
            if item.strip()
        ]

        user_concerns = [
            item.strip().lower()
            for item in concerns.split(",")
            if item.strip()
        ]

        ingredient_concerns = [
            item.strip().lower()
            for item in target_concerns.split(",")
            if item.strip()
        ]

        user_allergies = [
            item.strip().lower()
            for item in allergies.split(",")
            if item.strip()
        ]

        user_sensitivities = [
            item.strip().lower()
            for item in sensitivities.split(",")
            if item.strip()
        ]

        # ---------------------------------------
        # 4. Skin type matching
        # ---------------------------------------

        skin_type_match = False

        if skin_type_lower in suitable_types:
            skin_type_match = True

        # ---------------------------------------
        # 5. Concern matching
        # ---------------------------------------

        matched_concerns = []

        for concern in user_concerns:

            if concern in ingredient_concerns:
                matched_concerns.append(concern)

        # ---------------------------------------
        # 6. Allergy check
        # ---------------------------------------

        allergy_conflict = False

        ingredient_text = (
            ingredient_name_db.lower()
            + " "
            + warnings.lower()
        )

        for allergy in user_allergies:

            if allergy and allergy in ingredient_text:
                allergy_conflict = True

        # ---------------------------------------
        # 7. Sensitivity check
        # ---------------------------------------

        sensitivity_warning = False

        for sensitivity in user_sensitivities:

            if sensitivity and sensitivity in ingredient_text:
                sensitivity_warning = True

        # ---------------------------------------
        # 8. Calculate suitability score
        # ---------------------------------------

        score = 50

        if skin_type_match:
            score += 20
        else:
            score -= 10

        if matched_concerns:
            score += min(len(matched_concerns) * 10, 20)

        if allergy_conflict:
            score -= 50

        if sensitivity_warning:
            score -= 20

        score = max(0, min(score, 100))

        # ---------------------------------------
        # 9. Suitability result
        # ---------------------------------------

        if allergy_conflict:

            suitability = "Not Recommended"

            recommendation = (
                "This ingredient may conflict with an allergy "
                "recorded in your skin profile. Avoid using it "
                "until you receive appropriate professional advice."
            )

        elif sensitivity_warning:

            suitability = "Use With Caution"

            recommendation = (
                "Your profile contains a sensitivity that may "
                "require caution with this ingredient. Consider "
                "a patch test and introduce it gradually."
            )

        elif score >= 80:

            suitability = "Highly Suitable"

            recommendation = (
                "This ingredient appears well matched to your "
                "recorded skin type and concerns."
            )

        elif score >= 60:

            suitability = "Generally Suitable"

            recommendation = (
                "This ingredient appears reasonably compatible "
                "with your current skin profile."
            )

        else:

            suitability = "Limited Suitability"

            recommendation = (
                "This ingredient does not strongly match your "
                "current skin profile."
            )

        # ---------------------------------------
        # 10. Concern result
        # ---------------------------------------

        if matched_concerns:

            concern_match = (
                "Matches: "
                + ", ".join(matched_concerns)
            )

        else:

            concern_match = (
                "No direct concern match found."
            )

        # ---------------------------------------
        # 11. Allergy result
        # ---------------------------------------

        if allergy_conflict:

            allergy_check = (
                "Potential conflict detected."
            )

        elif user_allergies:

            allergy_check = (
                "No direct conflict detected from recorded allergies."
            )

        else:

            allergy_check = (
                "No allergies recorded."
            )

        # ---------------------------------------
        # 12. Sensitivity result
        # ---------------------------------------

        if sensitivity_warning:

            sensitivity_check = (
                "Potential sensitivity concern detected."
            )

        elif user_sensitivities:

            sensitivity_check = (
                "No direct conflict detected from recorded sensitivities."
            )

        else:

            sensitivity_check = (
                "No sensitivities recorded."
            )

        # ---------------------------------------
        # 13. Return result
        # ---------------------------------------

        return {
            "user_id": user_id,
            "ingredient": ingredient_name_db,
            "suitability": suitability,
            "suitability_score": score,
            "skin_type": skin_type,
            "concern_match": concern_match,
            "allergy_check": allergy_check,
            "sensitivity_check": sensitivity_check,
            "recommendation": recommendation
        }

    except HTTPException:
        raise

    except Exception as e:

        print("INGREDIENT ASSESSMENT ERROR:", e)

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to assess ingredient"
        )

@app.get("/products")
def get_products():
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, brand, category, price, ingredients,
                   suitable_skin_types, target_concerns, description
            FROM products
            ORDER BY name;
        """)

        rows = cursor.fetchall()
        cursor.close()

        products = []

        for row in rows:
            products.append({
                "id": row[0],
                "name": row[1],
                "brand": row[2],
                "category": row[3],
                "price": float(row[4]),
                "ingredients": row[5],
                "suitable_skin_types": row[6],
                "target_concerns": row[7],
                "description": row[8]
            })

        return products

    except Exception as e:
        print("PRODUCT ERROR:", e)
        conn.rollback()

        return {
            "error": str(e)
        }
@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: int):
    try:
        cursor = conn.cursor()

        # ---------------------------------------------------------
        # GET USER'S LATEST SKIN PROFILE
        # ---------------------------------------------------------
        cursor.execute("""
            SELECT
                skin_type,
                concerns,
                allergies,
                sensitivities
            FROM skin_profiles
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1;
        """, (user_id,))

        profile = cursor.fetchone()

        if not profile:
            cursor.close()

            raise HTTPException(
                status_code=404,
                detail="Skin profile not found"
            )

        skin_type = (profile[0] or "").strip().lower()

        concerns = [
            concern.strip().lower()
            for concern in (profile[1] or "").split(",")
            if concern.strip()
        ]

        allergies = [
            allergy.strip().lower()
            for allergy in (profile[2] or "").split(",")
            if allergy.strip()
        ]

        sensitivities = [
            sensitivity.strip().lower()
            for sensitivity in (profile[3] or "").split(",")
            if sensitivity.strip()
        ]

        # ---------------------------------------------------------
        # GET ALL PRODUCTS
        # ---------------------------------------------------------
        cursor.execute("""
            SELECT
                id,
                name,
                brand,
                category,
                price,
                ingredients,
                suitable_skin_types,
                target_concerns,
                description
            FROM products;
        """)

        products = cursor.fetchall()

        cursor.close()

        recommendations = []

        # ---------------------------------------------------------
        # CHECK EACH PRODUCT
        # ---------------------------------------------------------
        for product in products:

            product_id = product[0]
            product_name = product[1]
            brand = product[2]
            category = product[3]
            price = product[4]
            ingredients = product[5] or ""
            suitable_skin_types = product[6] or ""
            target_concerns_text = product[7] or ""
            description = product[8] or ""

            # Convert product information to lowercase
            ingredient_text = ingredients.lower()

            # -----------------------------------------------------
            # PRODUCT SKIN TYPES
            # -----------------------------------------------------
            suitable_types = [
                item.strip().lower()
                for item in suitable_skin_types.split(",")
                if item.strip()
            ]

            # -----------------------------------------------------
            # PRODUCT TARGET CONCERNS
            # -----------------------------------------------------
            target_concerns = [
                item.strip().lower()
                for item in target_concerns_text.split(",")
                if item.strip()
            ]

            # -----------------------------------------------------
            # SKIN TYPE FILTER
            # -----------------------------------------------------
            if skin_type not in suitable_types:
                continue

            # -----------------------------------------------------
            # ALLERGY CHECK
            # -----------------------------------------------------
            matched_allergies = []

            for allergy in allergies:

                if allergy and allergy in ingredient_text:
                    matched_allergies.append(allergy)

            # -----------------------------------------------------
            # SENSITIVITY CHECK
            # -----------------------------------------------------
            matched_sensitivities = []

            for sensitivity in sensitivities:

                if sensitivity and sensitivity in ingredient_text:
                    matched_sensitivities.append(sensitivity)

            # -----------------------------------------------------
            # SAFETY FILTER
            # -----------------------------------------------------
            # If a direct allergy is found, do NOT recommend product.
            if matched_allergies:
                continue

            # -----------------------------------------------------
            # BASE MATCH SCORE
            # -----------------------------------------------------
            score = 50

            # -----------------------------------------------------
            # CONCERN MATCHING
            # -----------------------------------------------------
            matched_concerns = []

            for concern in concerns:

                if concern in target_concerns:

                    matched_concerns.append(concern)

                    score += 25

            # Maximum score
            score = min(score, 100)

            # -----------------------------------------------------
            # SENSITIVITY PENALTY
            # -----------------------------------------------------
            if matched_sensitivities:

                score -= 20

                if score < 0:
                    score = 0

            # -----------------------------------------------------
            # SAFETY STATUS
            # -----------------------------------------------------
            if matched_sensitivities:

                safety_status = "Use with caution"

            else:

                safety_status = "Suitable"

            # -----------------------------------------------------
            # EXPLANATION
            # -----------------------------------------------------
            explanation_parts = []

            # Skin type explanation
            explanation_parts.append(
                f"Suitable for your {profile[0]} skin."
            )

            # Concern explanation
            if matched_concerns:

                explanation_parts.append(
                    f"Targets your skin concerns: "
                    f"{', '.join(matched_concerns)}."
                )

            # Sensitivity explanation
            if matched_sensitivities:

                explanation_parts.append(
                    f"Contains ingredients related to your "
                    f"sensitivity: {', '.join(matched_sensitivities)}. "
                    f"Use with caution and consider a patch test."
                )

            explanation = " ".join(explanation_parts)

            # -----------------------------------------------------
            # ADD PRODUCT TO RECOMMENDATIONS
            # -----------------------------------------------------
            recommendations.append({

                "id": product_id,

                "name": product_name,

                "brand": brand,

                "category": category,

                "price": float(price),

                "ingredients": ingredients,

                "suitable_skin_types": suitable_skin_types,

                "target_concerns": target_concerns_text,

                "description": description,

                "match_score": score,

                "matched_concerns": matched_concerns,

                "matched_allergies": matched_allergies,

                "matched_sensitivities": matched_sensitivities,

                "safety_status": safety_status,

                "explanation": explanation
            })

        # ---------------------------------------------------------
        # SORT PRODUCTS BY MATCH SCORE
        # ---------------------------------------------------------
        recommendations.sort(
            key=lambda item: item["match_score"],
            reverse=True
        )

        # ---------------------------------------------------------
        # RETURN RESPONSE
        # ---------------------------------------------------------
        return {

            "user_id": user_id,

            "skin_type": profile[0],

            "concerns": profile[1],

            "allergies": profile[2],

            "sensitivities": profile[3],

            "recommendations": recommendations
        }

    # -------------------------------------------------------------
    # HANDLE HTTP EXCEPTIONS
    # -------------------------------------------------------------
    except HTTPException:
        raise

    # -------------------------------------------------------------
    # HANDLE SERVER ERRORS
    # -------------------------------------------------------------
    except Exception as e:

        print("RECOMMENDATION ERROR:", e)

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Recommendation server error"
        )

@app.post("/progress")
def save_progress(progress: ProgressData):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO progress_tracking (
                user_id,
                progress_date,
                skin_health_score,
                acne_level,
                dryness_level,
                oiliness_level,
                redness_level,
                pigmentation_level,
                sensitivity_level,
                routine_adherence,
                notes
            )
            VALUES (
                %s, CURRENT_DATE, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            RETURNING id;
        """,  (
            progress.user_id,
            progress.skin_health_score,
            progress.acne_level,
            progress.dryness_level,
            progress.oiliness_level,
            progress.redness_level,
            progress.pigmentation_level,
            progress.sensitivity_level,
            progress.routine_adherence,
            progress.notes
        ))

        progress_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()

        return {
            "message": "Progress saved successfully",
            "progress_id": progress_id
        }

    except Exception as e:
        conn.rollback()
        print("PROGRESS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to save progress"
        )
@app.get("/progress/{user_id}")
def get_progress(user_id: int):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                user_id,
                progress_date,
                skin_health_score,
                acne_level,
                dryness_level,
                oiliness_level,
                redness_level,
                pigmentation_level,
                sensitivity_level,
                routine_adherence,
                notes,
                created_at
            FROM progress_tracking
            WHERE user_id = %s
            ORDER BY progress_date DESC, id DESC;
        """, (user_id,))

        rows = cursor.fetchall()
        cursor.close()

        progress_data = []

        for row in rows:
            progress_data.append({
                "id": row[0],
                "user_id": row[1],
                "progress_date": str(row[2]),
                "skin_health_score": row[3],
                "acne_level": row[4],
                "dryness_level": row[5],
                "oiliness_level": row[6],
                "redness_level": row[7],
                "pigmentation_level": row[8],
                "sensitivity_level": row[9],
                "routine_adherence": row[10],
                "notes": row[11],
                "created_at": str(row[12])
            })

        return progress_data

    except Exception as e:
        print("GET PROGRESS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve progress"
        )
@app.get("/analytics/{user_id}")
def get_analytics(user_id: int):
    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                progress_date,
                skin_health_score,
                acne_level,
                dryness_level,
                oiliness_level,
                redness_level,
                pigmentation_level,
                sensitivity_level,
                routine_adherence
            FROM progress_tracking
            WHERE user_id = %s
            ORDER BY progress_date ASC, id ASC;
        """, (user_id,))

        rows = cursor.fetchall()
        cursor.close()

        if not rows:
            return {
                "user_id": user_id,
                "total_records": 0,
                "message": "No progress data available"
            }

        # Skin health scores
        scores = [
            row[1]
            for row in rows
            if row[1] is not None
        ]

        first_score = scores[0] if scores else None
        latest_score = scores[-1] if scores else None

        improvement = None

        if first_score is not None and latest_score is not None:
            improvement = latest_score - first_score

        # Overall trend
        trend = "Stable"

        if improvement is not None:
            if improvement > 0:
                trend = "Improving"
            elif improvement < 0:
                trend = "Needs Attention"

        # Average routine adherence
        adherence_values = [
            row[8]
            for row in rows
            if row[8] is not None
        ]

        average_adherence = 0

        if adherence_values:
            average_adherence = round(
                sum(adherence_values) / len(adherence_values)
            )

        return {
            "user_id": user_id,
            "total_records": len(rows),

            "first_score": first_score,
            "latest_score": latest_score,
            "improvement": improvement,
            "trend": trend,

            "average_routine_adherence": average_adherence,

            "records": [
                {
                    "date": str(row[0]),
                    "skin_health_score": row[1],
                    "acne_level": row[2],
                    "dryness_level": row[3],
                    "oiliness_level": row[4],
                    "redness_level": row[5],
                    "pigmentation_level": row[6],
                    "sensitivity_level": row[7],
                    "routine_adherence": row[8]
                }
                for row in rows
            ]
        }

    except Exception as e:
        print("ANALYTICS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to calculate analytics"
        )
@app.get("/ai-predict/{user_id}")
def ai_predict_skin_concern(user_id: int):

    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                acne,
                dryness,
                oiliness,
                redness,
                pigmentation,
                sensitivity
            FROM skin_assessments
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1;
        """, (user_id,))

        assessment = cursor.fetchone()
        cursor.close()

        if not assessment:
            raise HTTPException(
                status_code=404,
                detail="No skin assessment found for this user"
            )

        # Convert assessment levels into numbers
        level_map = {
            "none": 0,
            "mild": 1,
            "moderate": 2,
            "severe": 3
        }

        acne = level_map.get(
            assessment[0].strip().lower(), 0
        )

        dryness = level_map.get(
            assessment[1].strip().lower(), 0
        )

        oiliness = level_map.get(
            assessment[2].strip().lower(), 0
        )

        redness = level_map.get(
            assessment[3].strip().lower(), 0
        )

        pigmentation = level_map.get(
            assessment[4].strip().lower(), 0
        )

        sensitivity = level_map.get(
            assessment[5].strip().lower(), 0
        )

        result = predict_skin_concern(
            acne,
            dryness,
            oiliness,
            redness,
            pigmentation,
            sensitivity
        )

        return {
            "user_id": user_id,
            "ai_prediction": result["predicted_concern"],
            "confidence": result["confidence"],
            "message": (
                "AI model analyzed the latest skin assessment."
            )
        }

    except HTTPException:
        raise

    except Exception as e:
        print("AI PREDICTION ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to generate AI skin prediction"
        )
# =========================================================
# ADMIN / EXECUTIVE DASHBOARD
# =========================================================

@app.get("/admin/dashboard")
def get_admin_dashboard():

    try:
        cursor = conn.cursor()

        # -------------------------------------------------
        # TOTAL USERS
        # -------------------------------------------------
        cursor.execute("""
            SELECT COUNT(*)
            FROM users;
        """)

        total_users = cursor.fetchone()[0]

        # -------------------------------------------------
        # TOTAL SKIN PROFILES
        # -------------------------------------------------
        cursor.execute("""
            SELECT COUNT(*)
            FROM skin_profiles;
        """)

        total_skin_profiles = cursor.fetchone()[0]

        # -------------------------------------------------
        # TOTAL SKIN ASSESSMENTS
        # -------------------------------------------------
        cursor.execute("""
            SELECT COUNT(*)
            FROM skin_assessments;
        """)

        total_assessments = cursor.fetchone()[0]

        # -------------------------------------------------
        # TOTAL PRODUCTS
        # -------------------------------------------------
        cursor.execute("""
            SELECT COUNT(*)
            FROM products;
        """)

        total_products = cursor.fetchone()[0]

        # -------------------------------------------------
        # TOTAL INGREDIENTS
        # -------------------------------------------------
        cursor.execute("""
            SELECT COUNT(*)
            FROM ingredients;
        """)

        total_ingredients = cursor.fetchone()[0]

        # -------------------------------------------------
        # AVERAGE SKIN HEALTH SCORE
        # -------------------------------------------------
        cursor.execute("""
            SELECT COALESCE(AVG(skin_health_score), 0)
            FROM progress_tracking;
        """)

        average_health_score = cursor.fetchone()[0]

        # -------------------------------------------------
        # SKIN TYPE DISTRIBUTION
        # -------------------------------------------------
        cursor.execute("""
            SELECT skin_type, COUNT(*)
            FROM skin_profiles
            GROUP BY skin_type
            ORDER BY COUNT(*) DESC;
        """)

        skin_type_rows = cursor.fetchall()

        skin_type_distribution = []

        for row in skin_type_rows:
            skin_type_distribution.append({
                "skin_type": row[0],
                "count": row[1]
            })

        # -------------------------------------------------
        # COMMON SKIN CONCERNS
        # -------------------------------------------------
        cursor.execute("""
            SELECT concerns
            FROM skin_profiles
            WHERE concerns IS NOT NULL
              AND TRIM(concerns) <> '';
        """)

        concern_rows = cursor.fetchall()

        concern_counts = {}

        for row in concern_rows:

            concerns_text = row[0] or ""

            concerns = concerns_text.split(",")

            for concern in concerns:

                concern = concern.strip()

                if concern:
                    concern_counts[concern] = (
                        concern_counts.get(concern, 0) + 1
                    )

        common_concerns = []

        for concern, count in concern_counts.items():

            common_concerns.append({
                "concern": concern,
                "count": count
            })

        common_concerns.sort(
            key=lambda item: item["count"],
            reverse=True
        )

        # -------------------------------------------------
        # RECENT ASSESSMENTS
        # -------------------------------------------------
        cursor.execute("""
            SELECT
                id,
                user_id,
                result,
                score
            FROM skin_assessments
            ORDER BY id DESC
            LIMIT 10;
        """)

        assessment_rows = cursor.fetchall()

        recent_assessments = []

        for row in assessment_rows:

            recent_assessments.append({
                "id": row[0],
                "user_id": row[1],
                "result": row[2],
                "score": row[3]
            })

        # -------------------------------------------------
        # RECENT PROGRESS
        # -------------------------------------------------
        cursor.execute("""
            SELECT
                user_id,
                progress_date,
                skin_health_score,
                routine_adherence
            FROM progress_tracking
            ORDER BY progress_date DESC, id DESC
            LIMIT 10;
        """)

        progress_rows = cursor.fetchall()

        recent_progress = []

        for row in progress_rows:

            recent_progress.append({
                "user_id": row[0],
                "progress_date": str(row[1]),
                "skin_health_score": row[2],
                "routine_adherence": row[3]
            })

        cursor.close()

        # -------------------------------------------------
        # FINAL RESPONSE
        # -------------------------------------------------

        return {

            "total_users": total_users,

            "total_skin_profiles": total_skin_profiles,

            "total_assessments": total_assessments,

            "total_products": total_products,

            "total_ingredients": total_ingredients,

            "average_health_score": round(
                float(average_health_score), 2
            ),

            "skin_type_distribution":
                skin_type_distribution,

            "common_concerns":
                common_concerns[:10],

            "recent_assessments":
                recent_assessments,

            "recent_progress":
                recent_progress

        }

    except Exception as e:

        print("ADMIN DASHBOARD ERROR:", e)

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to load admin dashboard"
        )
# =========================================================
# CONSULTANT / DERMATOLOGIST - PATIENT PROFILES
# =========================================================

@app.get("/consultant/patients")
def get_consultant_patients():

    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                u.id,
                u.name,
                u.email,
                sp.skin_type,
                sp.age_group,
                sp.concerns,
                sp.allergies,
                sp.sensitivities
            FROM users u
            LEFT JOIN LATERAL (
                SELECT
                    skin_type,
                    age_group,
                    concerns,
                    allergies,
                    sensitivities
                FROM skin_profiles
                WHERE user_id = u.id
                ORDER BY id DESC
                LIMIT 1
            ) sp ON TRUE
            WHERE u.role = 'user'
            ORDER BY u.id DESC;
        """)

        rows = cursor.fetchall()
        cursor.close()

        patients = []

        for row in rows:
            patients.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "skin_type": row[3] or "Not available",
                "age_group": row[4] or "Not available",
                "concerns": row[5] or "None recorded",
                "allergies": row[6] or "None recorded",
                "sensitivities": row[7] or "None recorded"
            })

        return {
            "total_patients": len(patients),
            "patients": patients
        }

    except Exception as e:
        print("CONSULTANT PATIENT ERROR:", e)
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to load patient profiles"
        )
# =========================================================
# CONSULTANT / DERMATOLOGIST - SKIN ASSESSMENTS
# =========================================================

@app.get("/consultant/assessments")
def get_consultant_assessments():

    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                sa.id,
                sa.user_id,
                u.name,
                u.email,
                sa.acne,
                sa.dryness,
                sa.oiliness,
                sa.redness,
                sa.pigmentation,
                sa.sensitivity,
                sa.score,
                sa.result
            FROM skin_assessments sa
            JOIN users u ON sa.user_id = u.id
            ORDER BY sa.id DESC;
        """)

        rows = cursor.fetchall()
        cursor.close()

        assessments = []

        for row in rows:
            assessments.append({
                "id": row[0],
                "user_id": row[1],
                "name": row[2],
                "email": row[3],
                "acne": row[4],
                "dryness": row[5],
                "oiliness": row[6],
                "redness": row[7],
                "pigmentation": row[8],
                "sensitivity": row[9],
                "score": row[10],
                "result": row[11]
            })

        return {
            "total_assessments": len(assessments),
            "assessments": assessments
        }

    except Exception as e:
        print("CONSULTANT ASSESSMENT ERROR:", e)
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to load patient assessments"
        )

@app.post("/consultant/guidance")
def save_guidance(data: GuidanceData):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO skincare_guidance (user_id, guidance)
            VALUES (%s, %s)
            RETURNING id;
            """,
            (data.user_id, data.guidance)
        )

        guidance_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()

        return {
            "message": "Guidance saved successfully",
            "guidance_id": guidance_id
        }

    except Exception as e:
        print("GUIDANCE SAVE ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save skincare guidance"
        )
@app.get("/consultant/guidance/{user_id}")
def get_patient_guidance(user_id: int):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT guidance, created_at
            FROM skincare_guidance
            WHERE user_id = %s
            ORDER BY id DESC;
            """,
            (user_id,)
        )

        rows = cursor.fetchall()
        cursor.close()

        guidance_list = []

        for row in rows:
            guidance_list.append({
                "guidance": row[0],
                "created_at": row[1]
            })

        return {
            "guidance": guidance_list
        }

    except Exception as e:
        print("GUIDANCE FETCH ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to load skincare guidance"
        )
@app.post("/consultant/consultations")
def create_consultation(data: ConsultationData):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO consultations
            (user_id, consultant_id, consultation_date, notes)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
            """,
            (
                data.user_id,
                data.consultant_id,
                data.consultation_date,
                data.notes
            )
        )

        consultation_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()

        return {
            "message": "Consultation created successfully",
            "consultation_id": consultation_id
        }

    except Exception as e:
        print("CONSULTATION ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to create consultation"
        )
@app.get("/consultant/consultations")
def get_consultations():
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                c.id,
                c.user_id,
                patient.name,
                patient.email,
                c.consultant_id,
                consultant.name,
                c.consultation_date,
                c.status,
                c.notes
            FROM consultations c
            JOIN users patient
                ON c.user_id = patient.id
            LEFT JOIN users consultant
                ON c.consultant_id = consultant.id
            ORDER BY c.consultation_date DESC;
            """
        )

        rows = cursor.fetchall()
        cursor.close()

        consultations = []

        for row in rows:
            consultations.append({
                "id": row[0],
                "user_id": row[1],
                "patient_name": row[2],
                "patient_email": row[3],
                "consultant_id": row[4],
                "consultant_name": row[5],
                "consultation_date": row[6],
                "status": row[7],
                "notes": row[8]
            })

        return {
            "total_consultations": len(consultations),
            "consultations": consultations
        }

    except Exception as e:
        print("CONSULTATION FETCH ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to load consultations"
        )
@app.post("/user/consultations")
def book_consultation(data: ConsultationData):
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO consultations
            (user_id, consultant_id, consultation_date, notes)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
            """,
            (
                data.user_id,
                data.consultant_id,
                data.consultation_date,
                data.notes
            )
        )

        consultation_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()

        return {
            "message": "Consultation booked successfully",
            "consultation_id": consultation_id
        }

    except Exception as e:
        print("BOOK CONSULTATION ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to book consultation"
        )
@app.get("/user/consultants")
def get_available_consultants():
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id, name, email, role
            FROM users
            WHERE role IN ('consultant', 'dermatologist')
            ORDER BY name;
            """
        )

        rows = cursor.fetchall()
        cursor.close()

        consultants = []

        for row in rows:
            consultants.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3]
            })

        return {
            "consultants": consultants
        }

    except Exception as e:
        print("CONSULTANT LIST ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to load consultants"
        )

class ConsultationStatusData(BaseModel):
    status: str

@app.put("/consultant/consultations/{consultation_id}/status")
def update_consultation_status(
    consultation_id: int,
    data: ConsultationStatusData
):
    allowed_statuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled"
    ]

    if data.status.lower() not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid consultation status"
        )

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE consultations
            SET status = %s
            WHERE id = %s
            RETURNING id, status;
            """,
            (data.status.lower(), consultation_id)
        )

        updated = cursor.fetchone()

        if not updated:
            cursor.close()
            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        conn.commit()
        cursor.close()

        return {
            "message": "Consultation status updated successfully",
            "consultation_id": updated[0],
            "status": updated[1]
        }

    except HTTPException:
        raise
    except Exception as e:
        print("CONSULTATION STATUS ERROR:", e)
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to update consultation status"
        )
