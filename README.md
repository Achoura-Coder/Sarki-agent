# Sarki Microfinance — App Agent

Application terrain pour les agents de microfinance.

## Vues
- **Tournée** — KPIs du jour, prochains arrêts géolocalisés
- **Membres** — recherche par code, nom ou téléphone
- **Profil membre** — épargne, prêt, tontine, score, actions terrain
- **Actions** — enregistrer un dépôt, une cotisation tontine, un remboursement
- **Enrôlement** — KYC rapide sur le terrain

## Stack
Vite + React 18 + Tailwind + lucide-react.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

## Notes

L'app fonctionne actuellement en **mode démonstration uniquement**. Le branchement
sur l'API REST réelle nécessite l'ajout d'endpoints agent (`/api/v1/agent/*`) côté
Odoo permettant de lire et écrire sur **n'importe quel membre** (au lieu du seul
membre lié au token comme pour l'app membre).

## Déploiement

CI/CD configuré : à chaque push sur `main`, l'app est buildée et déployée
dans `/opt/sarki-agent/` sur le serveur (workflow `.github/workflows/deploy.yml`).

## Licence
LGPL-3
