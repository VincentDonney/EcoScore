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
        result = self.classifier.infer(inputs, print_result=False)
        return result

    def __call__(self, text, aspect):
        if isinstance(text, str):
            return self.infer(text, aspect)
        if isinstance(text, list):
            return [self.infer(t, a) for t, a in zip(text, aspect)]


def main():
    sentiment_analysis = SentimentAnalysis()
    text = "Le trie des déchets n'est pas vraiment bien mais le service si!"
    aspect = ["déchets", "service"]
    print(sentiment_analysis(text, aspect))

    texts = ["Le trie des déchets n'est pas vraiment bien mais le service si!", "Le trie des déchets n'est pas vraiment bien mais le service si!"]
    aspects = [["déchets", "service"], ["déchets", "service"]]
    print(sentiment_analysis(texts, aspects))



if __name__ == '__main__':
    main()
