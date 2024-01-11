import json

from keywords_analysis import KeywordsExtractor
from sentiment_analysis import SentimentAnalysis


class RateRestaurants:
    def __init__(self):
        self.data = None
        self.keywords_extractor = KeywordsExtractor()
        self.keywords_extractor.load_keywords('keywords.csv')
        self.sentiment_analysis = SentimentAnalysis()
        self.rating = None

    def load_json(self, path_json):
        with open(path_json, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

    def store_json(self, path_json, data):
        with open(path_json, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def rate(self, path_json, json_output):
        self.load_json(path_json)
        if self.data is None:
            raise Exception("You must load a json file first!")
        output = []
        for restaurant in self.data:
            reviews_sentiments = []
            for review in restaurant['reviews']:
                text = review['text']
                keywords = self.keywords_extractor.extract_keywords(review['text'])
                aspects = [keyword[0] for keyword in keywords]
                themes = [keyword[2] for keyword in keywords]
                results = self.sentiment_analysis(text, aspects)

                reviews_sentiments.append((themes, results['sentiment']))
            # rate = {'organic': 0, 'climate':1, 'water_savy':2, 'social':3, 'governance':4, 'waste':5, 'adverse':0}
            rate = self.rating(reviews_sentiments)
        output.append((restaurant['name'], rate))
        # out = [{'name':restaurant_name, 'url': url_restaurant, 'rate': {'organic': 0, 'climate':1, 'water_savy':2, 'social':3, 'governance':4, 'waste':5, 'adverse':0}}, ...]
        self.store_json(json_output, output)



