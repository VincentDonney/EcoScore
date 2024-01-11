from keywords_analysis import KeywordsExtractor
from sentiment_analysis import SentimentAnalysis
from notation import Notation


def main():
    keywords_extractor = KeywordsExtractor()
    keywords_extractor.load_keywords("keywords.csv")

    sentiment_analysis = SentimentAnalysis()

    text = "Le trie des déchets n'est pas vraiment bien mais le service si!"

    keywords = keywords_extractor.extract_keywords(text)
    aspects = [keyword[0] for keyword in keywords]
    print(aspects)

    res = sentiment_analysis(text, aspects)
    #
    print(text)
    sentiments = []
    for keyword, sentiment in zip(keywords, res["sentiment"]):
        print(
            "keyword :",
            keyword[0],
            " | theme :",
            keyword[2],
            " | sentiment :",
            sentiment,
        )
        sentiments.append((keyword[2], sentiment))
    # sentiments = [
    # ("Biologique", "positif"),
    # ("Climat", "négatif"),
    # ("Eau", "positif"),
    # ("Eau", "positif"),
    # ("Social", "positif")
    # ]

    notation = Notation()
    notation.note(sentiments)
    print(notation.notation)


if __name__ == "__main__":
    main()
