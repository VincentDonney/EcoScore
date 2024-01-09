from keywords_analysis import KeywordsExtractor
from sentiment_analysis import SentimentAnalysis


def main():
    keywords_extractor = KeywordsExtractor()
    keywords_extractor.load_keywords('keywords.csv')

    sentiment_analysis = SentimentAnalysis()

    text = "Le trie des déchets n'est pas vraiment bien mais le service si!"

    keywords = keywords_extractor.extract_keywords(text)
    aspects = [keyword[0] for keyword in keywords]

    res = sentiment_analysis(text, aspects)

    print(text)
    for keyword, sentiment in zip(keywords, res['sentiment']):
        print("keyword :", keyword[0], " | theme :", keyword[1], " | sentiment :", sentiment)


if __name__ == '__main__':
    main()
