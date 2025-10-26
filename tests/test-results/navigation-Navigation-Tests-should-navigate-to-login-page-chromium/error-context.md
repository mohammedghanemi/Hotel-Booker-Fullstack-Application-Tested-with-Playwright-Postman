# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading "🏨 Hotel Booker" [level=1] [ref=e6]
      - generic [ref=e7]: "API: 🟢 Online"
    - navigation [ref=e8]:
      - button "All Bookings" [ref=e9] [cursor=pointer]
      - button "Create Booking" [ref=e10] [cursor=pointer]
      - button "Login" [active] [ref=e11] [cursor=pointer]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Login" [level=2] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: "Username:"
          - textbox [ref=e18]: admin
        - generic [ref=e19]:
          - generic [ref=e20]: "Password:"
          - textbox [ref=e21]: password123
        - button "Login" [ref=e22] [cursor=pointer]
      - generic [ref=e23]:
        - paragraph [ref=e24]:
          - strong [ref=e25]: "Default Credentials:"
        - paragraph [ref=e26]:
          - text: "Username:"
          - code [ref=e27]: admin
        - paragraph [ref=e28]:
          - text: "Password:"
          - code [ref=e29]: password123
        - paragraph [ref=e30]: "Note: Authentication is required for UPDATE and DELETE operations"
  - contentinfo [ref=e31]:
    - paragraph [ref=e32]: Hotel Booker App - Fullstack React & Node.js
```