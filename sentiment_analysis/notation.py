class Notation:
    def calculer_note(self, valeurs):
        scores = {"Positive": 5, "Negative": 1}
        total = sum(scores[val] for val in valeurs if val in scores)
        moyenne = total / len(valeurs)
        return moyenne

    def note(self, sentiments):
        notation = {
            "organic": 3,
            "climate": 3,
            "water_savy": 3,
            "social": 3,
            "waste": 3,
            "governance": 3,
            "adverse": 3,
        }
        print(sentiments)
        dictionnaire_sentiment = {}
        for theme, sentiment in sentiments:
            if theme not in dictionnaire_sentiment:
                dictionnaire_sentiment[theme] = []
            dictionnaire_sentiment[theme].append(sentiment)
        for theme in notation:
            if theme in dictionnaire_sentiment:
                notation[theme] = self.calculer_note(dictionnaire_sentiment[theme])
        return notation

    def __call__(self, sentiments):
        return self.note(sentiments)
