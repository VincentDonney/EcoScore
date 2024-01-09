import csv

class KeywordsExtractor:
    def __init__(self):
        self.keywords = []
    def load_keywords(self, path_csv):
        with open(path_csv, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=',')
            for line in reader:
                theme = line[0].lower()
                keywords = [word.lower() for word in line[1:] if word != '']
                for keyword in keywords:
                    self.keywords.append((keyword, theme))
    def extract_keywords(self, text):
        words = text.lower().split()
        print(words)
        keywords = []
        for word in words:
            for keyword, theme in self.keywords:
                if word == keyword:
                    keywords.append((word, theme))
        return keywords
