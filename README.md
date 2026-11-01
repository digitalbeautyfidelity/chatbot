# Beauty Fidelity – site + chatbot Claude

```bash
cp .env.example .env   # y mettre ANTHROPIC_API_KEY
npm start              # http://localhost:3000
```

- Le chatbot appelle l'API Claude côté serveur (`server.js`), la clé n'est jamais exposée au navigateur.
- Tout son savoir vient de `knowledge/beauty-fidelity.md` (relu à chaque requête). Extraite du dépôt site-beauty-fidelity (lecture seule) ; à mettre à jour si les offres changent.
- Le bot refuse les sujets hors Beauty Fidelity et n'invente rien.
