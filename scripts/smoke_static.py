from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
required = ["index.html", "styles.css", "script.js", "README.md", "LICENSE"]
for name in required:
    path = ROOT / name
    assert path.exists(), f"Arquivo ausente: {name}"
html = (ROOT / "index.html").read_text(encoding="utf-8")
script = (ROOT / "script.js").read_text(encoding="utf-8")
for token in ["<main>", "data-mode=", "projectData", "Política de Dados"]:
    assert token in html, f"Token ausente: {token}"
external_calls = ["http" + "://", "https" + "://", "send" + "Beacon", "XML" + "HttpRequest", "Web" + "Socket"]
for token in external_calls:
    assert token not in script, f"Chamada externa inesperada: {token}"
print("smoke estatico ok")
