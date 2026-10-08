

SECTION_HEADINGS = {
    "PROFESSIONAL SUMMARY",
    "SUMMARY",
    "EDUCATION",
    "TECHNICAL SKILLS",
    "SKILLS",
    "EXPERIENCE",
    "WORK EXPERIENCE",
    "PROJECTS",
    "CERTIFICATIONS",
    "LANGUAGES",
}

def extract_sections(text: str):
    sections = {}

    current_section = None

    for line in text.splitlines():
        line = line.strip()


        if not line:
            continue
        if line.upper() in SECTION_HEADINGS:
            current_section = line.lower().replace(" ", "_")
            sections[current_section]=[]
            continue
        if current_section:
            sections[current_section].append(line)
        
    return sections

if __name__ == "__main__":
    sample_text = """
    KHADEEJA SULALA K V

    EDUCATION
    Central University of Karnataka
    Bachelor of Science – Mathematics

    PROJECTS
    SPARQ
    YouTube Clone

    CERTIFICATIONS
    Machine Learning with AI
    """

    result = extract_sections(sample_text)

    print(result)