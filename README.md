Simple Rate Finder
A mobile application built with React Native / Expo (frontend) and C# ASP.NET Minimal APIs with MySQL (backend).

What it does
Simple Rate Finder helps everyday savers quickly determine whether their current savings account is offering a competitive interest rate.
On login, users select their profile and are presented with a dashboard showing:
- The best available interest rate in the database.
- All of their linked savings accounts, including the product name, provider, and current rate.
- A per-account conclusion, either confirming they are on the best rate, or showing exactly how much more they could earn per year by switching to the best available option.

How it works
The backend exposes a set of Minimal API endpoints that query a MySQL database containing both market account data and customer account data. The frontend fetches the best market rate and the user's accounts independently on load, then computes the difference client-side to surface a simple, actionable recommendation for each account.
