"""
Hybrid Fuzzy Entity & Name Matching Engine
Solves the Indian multilingual transliteration & honorific variance challenge:
Score = 0.50 * Jaro-Winkler + 0.30 * TokenSortRatio + 0.20 * SoundexMatch
"""
import re
from typing import Dict, Any, Tuple


def normalize_indian_entity_name(name: str) -> str:
    """Normalizes business and individual names by stripping noise tokens and standardizing honorifics."""
    if not name:
        return ""
    text = name.upper().strip()
    
    # Standardize abbreviations and corporate suffixes
    replacements = [
        (r"\bPVT\.?\b", "PRIVATE"),
        (r"\bLTD\.?\b", "LIMITED"),
        (r"\bCORP\.?\b", "CORPORATION"),
        (r"\bINC\.?\b", "INCORPORATED"),
        (r"\bM/S\.?\b", ""),
        (r"\bMS\.?\b", ""),
        (r"\bSHRI\.?\b", ""),
        (r"\bSMT\.?\b", ""),
        (r"\bMR\.?\b", ""),
        (r"\bMRS\.?\b", ""),
        (r"\bDR\.?\b", ""),
        (r"\bENTERPRISE(S)?\b", ""),
        (r"\bSUPERSTORE(S)?\b", ""),
        (r"\bSTORE(S)?\b", ""),
        (r"\bTRADER(S)?\b", ""),
        (r"\bTECH\b", "TECHNOLOGIES"),
        (r"\bTECHNOLOGY\b", "TECHNOLOGIES"),
        (r"[^\w\s]", " "),  # Replace punctuations with spaces
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    
    return " ".join(text.split())


def jaro_distance(s1: str, s2: str) -> float:
    """Computes Jaro similarity between two strings."""
    if s1 == s2:
        return 1.0
    len1, len2 = len(s1), len(s2)
    if len1 == 0 or len2 == 0:
        return 0.0

    match_dist = max(len1, len2) // 2 - 1
    match_dist = max(0, match_dist)

    s1_matches = [False] * len1
    s2_matches = [False] * len2

    matches = 0
    for i in range(len1):
        start = max(0, i - match_dist)
        end = min(i + match_dist + 1, len2)
        for j in range(start, end):
            if s2_matches[j]:
                continue
            if s1[i] != s2[j]:
                continue
            s1_matches[i] = True
            s2_matches[j] = True
            matches += 1
            break

    if matches == 0:
        return 0.0

    transpositions = 0
    k = 0
    for i in range(len1):
        if not s1_matches[i]:
            continue
        while not s2_matches[k]:
            k += 1
        if s1[i] != s2[k]:
            transpositions += 1
        k += 1

    transpositions //= 2
    return (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3.0


def jaro_winkler_similarity(s1: str, s2: str, prefix_weight: float = 0.1) -> float:
    """Computes Jaro-Winkler similarity with prefix bonus."""
    j_dist = jaro_distance(s1, s2)
    if j_dist < 0.7:
        return j_dist

    # Common prefix length up to 4 characters
    prefix_len = 0
    for c1, c2 in zip(s1[:4], s2[:4]):
        if c1 == c2:
            prefix_len += 1
        else:
            break

    return j_dist + prefix_len * prefix_weight * (1.0 - j_dist)


def soundex(name: str) -> str:
    """Standard American Soundex algorithm for phonetic representation."""
    if not name:
        return "0000"
    name = re.sub(r"[^A-Z]", "", name.upper())
    if not name:
        return "0000"

    first_letter = name[0]
    mapping = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }

    digits = []
    prev_code = mapping.get(first_letter, "")
    for char in name[1:]:
        code = mapping.get(char, "")
        if code and code != prev_code:
            digits.append(code)
        prev_code = code

    soundex_code = (first_letter + "".join(digits) + "000")[:4]
    return soundex_code


def token_sort_ratio(s1: str, s2: str) -> float:
    """Computes similarity after tokenizing and alphabetically sorting words."""
    t1 = " ".join(sorted(s1.split()))
    t2 = " ".join(sorted(s2.split()))
    return jaro_distance(t1, t2)


def check_acronym_match(s1: str, s2: str) -> bool:
    """
    Checks if a token in one string is an acronym of multiple tokens in the other string.
    Example: 'INFOSYS BPM LIMITED' vs 'INFOSYS BUSINESS PROCESS MANAGEMENT LIMITED' -> True
    """
    t1 = s1.split()
    t2 = s2.split()
    if not t1 or not t2:
        return False
    if len(t1) > len(t2):
        t1, t2 = t2, t1  # t1 is shorter
    
    # Strip common prefix tokens
    while t1 and t2 and t1[0] == t2[0]:
        t1 = t1[1:]
        t2 = t2[1:]
        
    # Strip common suffix tokens
    while t1 and t2 and t1[-1] == t2[-1]:
        t1 = t1[:-1]
        t2 = t2[:-1]
        
    if len(t1) == 1 and len(t2) >= 2:
        acronym_candidate = t1[0]
        acronym_from_tokens = "".join(w[0] for w in t2 if w)
        if acronym_candidate == acronym_from_tokens:
            return True
    return False


def check_initials_match(s1: str, s2: str) -> bool:
    """
    Checks if one string is an initials expansion of another.
    Example: 'S. K. Gupta' vs 'Suresh Kumar Gupta' -> True
    """
    tokens1 = [t.replace(".", "") for t in s1.split() if t.replace(".", "")]
    tokens2 = [t.replace(".", "") for t in s2.split() if t.replace(".", "")]

    if not tokens1 or not tokens2:
        return False

    # Determine which token list is the abbreviated one by average word length
    avg_len1 = sum(len(t) for t in tokens1) / len(tokens1)
    avg_len2 = sum(len(t) for t in tokens2) / len(tokens2)
    if avg_len1 > avg_len2 or (avg_len1 == avg_len2 and len(tokens1) > len(tokens2)):
        tokens1, tokens2 = tokens2, tokens1

    # tokens1 is now the abbreviated list, tokens2 is the full list
    if tokens1[-1] == tokens2[-1]:
        prefix1 = tokens1[:-1]
        prefix2 = tokens2[:-1]
        if len(prefix1) <= len(prefix2):
            all_match = True
            for i, p1 in enumerate(prefix1):
                if len(p1) == 1 and p1 != prefix2[i][0]:
                    all_match = False
                elif len(p1) > 1 and p1 != prefix2[i]:
                    all_match = False
            if all_match:
                return True
    return False


def compute_hybrid_name_match(name1: str, name2: str) -> Tuple[float, Dict[str, Any]]:
    """
    Computes hybrid entity name similarity:
    Score = 0.50 * Jaro-Winkler + 0.30 * TokenSort + 0.20 * Soundex
    Returns (score_0_to_1, details_dict)
    """
    n1 = normalize_indian_entity_name(name1)
    n2 = normalize_indian_entity_name(name2)

    if not n1 or not n2:
        return 0.0, {"verdict": "EMPTY_INPUT", "score": 0.0}

    if n1 == n2:
        return 1.0, {
            "verdict": "EXACT_MATCH",
            "score": 1.0,
            "jaro_winkler": 1.0,
            "token_sort": 1.0,
            "soundex_match": True,
            "initials_match": True
        }

    is_acronym = check_acronym_match(n1, n2)
    if is_acronym:
        return 0.94, {
            "score": 0.94,
            "verdict": "SEMANTIC_MATCH",
            "name1_normalized": n1,
            "name2_normalized": n2,
            "jaro_winkler": 0.94,
            "token_sort": 0.94,
            "soundex_match": True,
            "is_acronym_match": True
        }

    jw = jaro_winkler_similarity(n1, n2)
    ts = token_sort_ratio(n1, n2)

    # Soundex check for key tokens
    s1_tokens = n1.split()
    s2_tokens = n2.split()
    soundex1 = [soundex(t) for t in s1_tokens]
    soundex2 = [soundex(t) for t in s2_tokens]
    soundex_match = (soundex1[-1] == soundex2[-1]) if (soundex1 and soundex2) else False
    soundex_score = 1.0 if soundex_match else 0.0

    initials_boost = 0.0
    is_initials_expansion = check_initials_match(n1, n2)
    if is_initials_expansion:
        initials_boost = 0.25

    raw_score = (0.50 * jw) + (0.30 * ts) + (0.20 * soundex_score) + initials_boost
    
    if is_initials_expansion and soundex_match:
        final_score = max(0.92, min(1.0, round(raw_score, 4)))
    else:
        final_score = min(1.0, round(raw_score, 4))

    if final_score >= 0.88:
        verdict = "SEMANTIC_MATCH"
    elif final_score >= 0.70:
        verdict = "AMBIGUOUS_REQUIRING_PENNY_DROP"
    else:
        verdict = "NAME_MISMATCH"

    return final_score, {
        "score": final_score,
        "verdict": verdict,
        "name1_normalized": n1,
        "name2_normalized": n2,
        "jaro_winkler": round(jw, 4),
        "token_sort": round(ts, 4),
        "soundex_match": soundex_match,
        "is_initials_expansion": is_initials_expansion
    }
