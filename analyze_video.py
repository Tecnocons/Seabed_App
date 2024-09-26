import cv2
import requests
import json
import sys
import os

# Imposta la chiave API Roboflow e il nome del progetto
ROBOFLOW_API_KEY = "UPDaC9ebZklwhtnWfSAm"
PROJECT_NAME = "new-underwater"
MODEL_VERSION = "1"
API_URL = f"https://detect.roboflow.com/{PROJECT_NAME}/{MODEL_VERSION}"

# Imposta i parametri del modello
params = {
    "api_key": ROBOFLOW_API_KEY,
    "confidence": "40",
    "overlap": "20",
}

# Prendi i percorsi del video di input e output come argomenti
input_video_path = sys.argv[1]
output_video_path = sys.argv[2]  # Secondo argomento per il percorso di output
print(f"START_ANALYSIS: Analizzando il video {input_video_path}")

if not os.path.exists(input_video_path):
    print(f"Errore: il file video non esiste {input_video_path}")
    sys.exit(1)

cap = cv2.VideoCapture(input_video_path)

# Ottieni informazioni sul video originale
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
fps = int(cap.get(cv2.CAP_PROP_FPS))
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

if total_frames == 0:
    print("Errore: il video sembra essere vuoto o corrotto.")
    sys.exit(1)

# Inizializza il writer per salvare il video di output
out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))

def analyze_frame(frame):
    _, img_encoded = cv2.imencode('.jpg', frame)
    img_bytes = img_encoded.tobytes()

    response = requests.post(API_URL, params=params, files={"file": img_bytes})

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Errore nella richiesta: {response.status_code}, {response.text}")
        return None

frame_count = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    progress = (frame_count / total_frames) * 100
    print(f"PROGRESS: {progress:.2f}%")

    result = analyze_frame(frame)
    
    if result is not None:
        predictions = result["predictions"]
        for pred in predictions:
            x, y, w, h = int(pred["x"]), int(pred["y"]), int(pred["width"]), int(pred["height"])
            class_name = pred["class"]
            confidence = pred["confidence"]

            start_point = (x - w // 2, y - h // 2)
            end_point = (x + w // 2, y + h // 2)

            cv2.rectangle(frame, start_point, end_point, (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name}: {confidence:.2f}", (start_point[0], start_point[1] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

    out.write(frame)

cap.release()
out.release()
cv2.destroyAllWindows()

if os.path.exists(output_video_path):
    print(f"COMPLETED: Video processato correttamente. Output salvato in: {output_video_path}")
else:
    print("Errore: il file di output non è stato generato correttamente.")
