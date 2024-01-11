class Notation:
    def __init__(self):
        self.notation = {
            "Biologique": 3,
            "Climat": 3,
            "Eau": 3,
            "Social": 3,
            "Gouvernance": 3,
            "Déchets": 3,
            "Négatif": 3,
        }

    def calculer_note(self, valeurs):
        scores = {"positif": 5, "négatif": 1}
        total = sum(scores[val] for val in valeurs if val in scores)
        moyenne = total / len(valeurs)
        return moyenne

    def note(self, sentiments):
        dictionnaire_sentiment = {}
        for theme, sentiment in sentiments:
            if theme not in dictionnaire_sentiment:
                dictionnaire_sentiment[theme] = []
            dictionnaire_sentiment[theme].append(sentiment)
        for theme in self.notation:
            if theme in dictionnaire_sentiment:
                self.notation[theme] = self.calculer_note(dictionnaire_sentiment[theme])
