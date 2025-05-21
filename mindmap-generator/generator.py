# import nltk
# import numpy as np
# from nltk import pos_tag, word_tokenize
# from nltk.chunk import RegexpParser
# from nltk.corpus import stopwords
# from sentence_transformers import SentenceTransformer
# from sklearn.cluster import KMeans
# import matplotlib.pyplot as plt
# import networkx as nx
# import base64
# from io import BytesIO

# class MindMapGenerator:
#     def __init__(self):
#         self._setup_nltk()
#         self.model = SentenceTransformer('all-MiniLM-L6-v2')

#     def _setup_nltk(self):
#         nltk.download('punkt')
#         nltk.download('stopwords')
#         nltk.download('averaged_perceptron_tagger')

#     def generate(self, text: str) -> dict:
#         # 1. Extract Noun Phrases (Your existing code)
#         tokens = word_tokenize(text)
#         tagged_tokens = pos_tag(tokens)
#         grammar = "NP: {<JJ>*<NN.*>+}"
#         chunk_parser = RegexpParser(grammar)
#         chunk_tree = chunk_parser.parse(tagged_tokens)
#         noun_phrases = [" ".join(word for word, tag in subtree.leaves()) 
#                        for subtree in chunk_tree.subtrees(filter=lambda t: t.label() == 'NP')]
#         keywords = list(set(noun_phrases))

#         # 2. Generate Mind Map Image
#         G = nx.Graph()
#         G.add_node("Main Idea")
#         for kw in keywords:
#             G.add_node(kw)
#             G.add_edge("Main Idea", kw)

#         plt.figure(figsize=(10, 10))
#         pos = nx.spring_layout(G, seed=42)
#         nx.draw(G, pos, with_labels=True, node_size=3000, font_size=10)
        
#         # Convert to Base64
#         buffer = BytesIO()
#         plt.savefig(buffer, format="png")
#         plt.close()
#         return {
#             "image": base64.b64encode(buffer.getvalue()).decode("utf-8"),
#             "keywords": keywords
#         }