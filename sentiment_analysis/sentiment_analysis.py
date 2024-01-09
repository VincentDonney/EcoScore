from pyabsa import APCCheckpointManager


class SentimentAnalysis:
    def __init__(self):
        self.classifier = APCCheckpointManager.get_sentiment_classifier(checkpoint='multilingual')

    def preprocess(self, text, aspect):
        words = text.split()
        words = [f"[ASP]{word}[ASP]" if word in aspect else word for word in words]
        output = " ".join(words)
        return output

    def infer(self, text, aspect):
        inputs = self.preprocess(text, aspect)
        result = self.classifier.infer(inputs)
        return result

    def infer_batch(self, texts, aspects):
        inputs = [self.preprocess(text, aspect) for text, aspect in zip(texts, aspects)]
        results = self.classifier.batch_infer(inputs)
        return results

    def __call__(self, text, aspect):
        if isinstance(text, str):
            result = self.infer(text, aspect)
        if isinstance(text, list):
            result = self.infer_batch(text, aspect)
        print(result)
        return result


def main():
    sentiment_analysis = SentimentAnalysis()
    'Le trie des [ASP]déchets[ASP] n\'est pas vraiment bien mais le [ASP]service[ASP] si!'
    text = "Le trie des déchets n'est pas vraiment bien mais le service si!"
    aspect = ["déchets", "service"]
    sentiment_analysis(text, aspect)


if __name__ == '__main__':
    main()
