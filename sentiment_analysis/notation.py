class Notation:
    def __init__(self):
        self.notation = {
            "organic": 3,
            "climate": 3,
            "water_savy": 3,
            "social": 3,
            "waste": 3,
            "governance": 3,
            "adverse": 3,
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
