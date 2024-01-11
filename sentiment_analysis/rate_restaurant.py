import csv
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

    def store_csv(self, path_csv, data):
        with open(path_csv, 'w', encoding='utf-8') as f:
            writer = csv.writer(f, delimiter=',')
            writer.writerow(['name', 'url', 'rate_organic', 'rate_climate', 'rate_water_savy', 'rate_social',
                             'rate_governance', 'rate_waste', 'rate_adverse'])
            for restaurant in data:
                writer.writerow([restaurant['name'], restaurant['url'], restaurant['rate']['organic'],
                                 restaurant['rate']['climate'], restaurant['rate']['water_savy'],
                                 restaurant['rate']['social'], restaurant['rate']['governance'],
                                 restaurant['rate']['waste'], restaurant['rate']['adverse']])

    def rate(self, path_json, output_csv):
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
        output.append((restaurant['name'], restaurant['url'], rate))
        self.store_csv(output_csv, output)



