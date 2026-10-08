import re


def clean_skill(skill: str):
    skill = skill.strip()

    skill = re.sub(r"^[•●▪◦‣\-–—]+\s*", "", skill)

    return skill.strip()


def add_unique_skill(skills: list[str], skill: str):
    skill = clean_skill(skill)

    if skill and not any(
        existing.lower() == skill.lower()
        for existing in skills
    ):
        skills.append(skill)


def extract_skills(technical_skills: list[str]):
    skills = []

    for line in technical_skills:
        line = line.strip()

        if not line:
            continue

        # Format: Languages: Python, JavaScript, C
        if ":" in line:
            _, skill_list = line.split(":", 1)

            for skill in skill_list.split(","):
                add_unique_skill(skills, skill)

        # Format: • Python / - Python
        elif line.startswith(("•", "●", "▪", "◦", "‣", "-", "–", "—")):
            skill = clean_skill(line)

            if skill:
                add_unique_skill(skills, skill)

        # Format: Python | JavaScript | SQL
        elif "|" in line:
            for skill in line.split("|"):
                add_unique_skill(skills, skill)

        # Format: Python; JavaScript; SQL
        elif ";" in line:
            for skill in line.split(";"):
                add_unique_skill(skills, skill)

    return skills


if __name__ == "__main__":

    technical_skills = [
        "Languages: Python, JavaScript, C",
        "• python",
        "• PYTHON",
        "Python | JavaScript | SQL",
        "SQL; Git"
    ]

    print(extract_skills(technical_skills))