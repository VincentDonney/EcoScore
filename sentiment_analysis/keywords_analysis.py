import csv
import fasttext.util
from nltk.corpus import stopwords
import nltk
import numpy as np
from scipy import spatial


class KeywordsExtractor:
    def __init__(self):
        nltk.download('stopwords')
        fasttext.util.download_model('fr', if_exists='ignore')  # French

        self.fasttext_model = fasttext.load_model('cc.fr.300.bin')

        self.stopwords = set(stopwords.words('french'))
        self.keywords = []
        self.threshold = 0.5

    def load_keywords(self, path_csv):
        with open(path_csv, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=',')
            for line in reader:
                theme = line[0].lower()
                keywords = [word.lower() for word in line[1:] if word != '']
                for keyword in keywords:
                    vector = self.fasttext_model.get_word_vector(keyword)
                    self.keywords.append((vector, keyword, theme))

    def extract_keywords(self, text):
        words = text.split()
        words = [word for word in words if word not in self.stopwords]
        keywords = []
        for word in words:
            v = self.fasttext_model.get_word_vector(word)
            distance = [spatial.distance.cosine(v, a) for a, _, _ in self.keywords]
            k = self.keywords[np.argmin(distance)]
            d = np.min(distance)
            if d < self.threshold:
                keywords.append((word, *k, d))
        return keywords

