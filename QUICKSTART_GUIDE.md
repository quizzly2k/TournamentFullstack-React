# Quick Start Guide - Tournament Manager with JWT Auth

## 🚀 Start the Application

### Step 1: Start the API (Backend)
```bash
cd api
dotnet run
```
API will be available at: **http://localhost:5050**

### Step 2: Start the Frontend (in a new terminal)
```bash
cd frontendvite
npm run dev
```
Frontend will be available at: **http://localhost:5173**

---

## 🔑 Test Credentials

### Admin Account (Pre-created)
- **Username**: `admin`
- **Password**: `Admin123!`
- **Role**: Admin (can see all tournaments, delete any)

### Test User Account (Pre-created) 
- **Username**: `testuser`
- **Password**: `TestUser123!`
- **Role**: User (can only see own tournaments)

### Create New User
- Click "Registrera här" (Register here) on login page
- Fill in username, email, password, first name, last name
- You'll be logged in automatically

---

## 📋 What You Can Do

### As Regular User
- ✅ Register new account
- ✅ Login with credentials
- ✅ Create tournaments
- ✅ Add games to your tournaments
- ✅ Edit your tournaments
- ✅ Delete your tournaments
- ✅ Edit your games
- ✅ Delete your games
- ❌ Cannot see other users' tournaments
- ❌ Cannot delete other users' tournaments

### As Admin
- ✅ See ALL tournaments from all users
- ✅ Delete ANY tournament (even other users')
- ✅ Manage all games
- ✅ Everything a regular user can do

---

## 🧪 Test Scenarios

### Scenario 1: User Registration & Login
1. Open http://localhost:5173
2. Click "Registrera här"
3. Fill in: username=`myuser`, email=`myuser@test.com`, password=`MyUser123!`, firstName=`My`, lastName=`User`
4. Click "Registrera"
5. You'll be logged in automatically

### Scenario 2: Create Tournament
1. After login, click "+ Lägg till turnering"
2. Fill in:
   - Name: "My Tournament"
   - Description: "Test tournament"
   - Max players: 8
   - Date: Tomorrow (or any future date)
3. Click "Lägg till"
4. Tournament appears in left sidebar

### Scenario 3: Add Game to Tournament
1. Click on your tournament in the sidebar
2. Click "+ Lägg till spel"
3. Fill in:
   - Game Name: "Quarterfinals"
   - Time: Tomorrow at 18:00
4. Click "Lägg till"
5. Game appears in the games list

### Scenario 4: Test Authorization
1. Login as `admin` / `Admin123!`
2. See all tournaments from all users
3. Try to delete a tournament from another user
4. It should work (admin override)
5. Logout and login as regular user
6. Try to delete tournament from another user
7. Button should not be visible (authorization prevents it)

### Scenario 5: Check Token in Browser
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Look for `tournament_jwt_token`
4. You'll see the JWT token
5. You can copy it and decode it at https://jwt.io

---

## 🔍 Verify JWT Token

### Using jwt.io Website
1. Copy your token from localStorage
2. Go to https://jwt.io
3. Paste token in the "Encoded" box
4. See your decoded claims:
   - `nameid` (UserId)
   - `name` (Username)
   - `email` (Email)
   - `FirstName`, `LastName`
   - `role` (Admin or User)

### Token Payload Example (Admin)
```json
{
  "nameid": "1",
  "name": "admin",
  "email": "admin@tournament.com",
  "FirstName": "Admin",
  "LastName": "User",
  "role": "Admin",
  "exp": 1775659405,
  "iss": "TournamentAPI",
  "aud": "TournamentClient"
}
```

---

## 📱 API Endpoints

### Authentication
```
POST /api/auth/register
  - Request: { username, email, password, firstName, lastName }
  - Response: { success, message, token, user }

POST /api/auth/login
  - Request: { username, password }
  - Response: { success, message, token, user }
```

### Tournaments
```
GET /api/tournaments
  - Returns: User's tournaments (or all if Admin)
  - Requires: Bearer token

POST /api/tournaments
  - Creates tournament owned by current user
  - Requires: Bearer token

PUT /api/tournaments/{id}
  - Updates tournament (owner only)
  - Requires: Bearer token + Ownership

DELETE /api/tournaments/{id}
  - Deletes tournament (Admin only)
  - Requires: Bearer token + Admin role
```

### Games
```
GET /api/tournaments/{id}/games
  - Returns: Games in tournament
  - Requires: Bearer token

POST /api/tournaments/{id}/games
  - Creates game in tournament
  - Requires: Bearer token + Ownership of tournament

PUT /api/tournaments/{id}/games/{gameId}
  - Updates game
  - Requires: Bearer token + Ownership

DELETE /api/tournaments/{id}/games/{gameId}
  - Deletes game
  - Requires: Bearer token + Ownership or Admin
```

---

## 🐛 Troubleshooting

### "API not responding" Error
- Make sure API is running: `dotnet run` in `api/` folder
- Check that it's running on http://localhost:5050
- Check terminal for error messages

### "Cannot register" Error
- Make sure username is unique
- Check password meets requirements (use strong password like `Pass123!`)
- Check email format is valid

### "Cannot see tournaments" After Login
- You're logged in as a new user with no tournaments
- Create a new tournament first
- Or login as `admin` to see all tournaments

### Token Expired Error
- Log out and log back in
- Tokens expire after 60 minutes of inactivity
- No refresh token implemented yet (use re-login)

### "Cannot edit/delete" Your Tournaments
- Make sure you're logged in as the owner
- Admins can edit/delete all tournaments
- Regular users can only manage their own

---

## 🔐 Security Notes

### Development (Current Setup)
- ✅ Passwords are hashed (bcrypt)
- ✅ JWT tokens are signed
- ✅ Authorization is enforced
- ✅ HTTPS ready (configured for localhost)
- ⚠️ JWT secret is hardcoded (change in production!)

### Production Recommendations
1. **Change JWT Secret** in `appsettings.json`
2. **Enable HTTPS** with real certificate
3. **Implement Token Refresh** for better UX
4. **Add Email Verification** for registration
5. **Add Rate Limiting** for login attempts
6. **Use Environment Variables** for secrets
7. **Add Audit Logging** for admin actions

---

## 📊 Database

### Current Tables
- **AspNetUsers** - User accounts
- **AspNetRoles** - Admin, User roles
- **AspNetUserRoles** - User-to-role mappings
- **Tournaments** - Tournaments with UserId
- **Games** - Games with UserId and TournamentId

### Pre-seeded Users
- Admin user created on first run
- Test user created on first run
- New users created via registration endpoint

---

## 💡 Tips & Tricks

### Test Multiple Users
1. Open incognito/private window
2. Register different user in each window
3. Switch between windows to test multi-user scenarios

### Clear Authentication
- Open DevTools > Application > Local Storage
- Delete `tournament_jwt_token` entry
- Refresh page (will show login form)

### Check API Logs
- Terminal running `dotnet run` shows all API calls
- Look for 401/403 errors to debug authorization

### Monitor Network
- DevTools > Network tab
- Look for Authorization header in requests
- Verify token is being sent

---

## 📚 Additional Resources

### Files to Review
- `AUTHENTICATION_IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `api/Program.cs` - Identity and JWT setup
- `api/Controllers/AuthController.cs` - Auth endpoints
- `frontendvite/src/contexts/AuthContextProvider.jsx` - Frontend auth logic
- `frontendvite/src/api/apiClient.js` - Token injection

### Code Examples
- See `AUTHENTICATION_IMPLEMENTATION_SUMMARY.md` for API endpoint examples
- Frontend components show how to use AuthContext

---

## 🎓 Learning Points

### Authentication vs Authorization
- **Authentication**: Verifying who you are (login)
- **Authorization**: What you're allowed to do (permissions)

### JWT Tokens
- Stateless (no server session needed)
- Self-contained (includes user info)
- Signed (can't be tampered with)
- Expire (60 minutes in this setup)

### Role-Based Access Control
- Each user has one or more roles (Admin, User)
- Roles determine what actions are allowed
- Can be checked with `User.IsInRole("Admin")`

### Ownership-Based Access
- Each resource (Tournament, Game) has a UserId
- Only owner can modify (unless Admin)
- Checked by comparing UserId in token to resource UserId

---

**Ready to start?** 🚀  
1. Run `dotnet run` in `api/` folder
2. Run `npm run dev` in `frontendvite/` folder  
3. Open `http://localhost:5173`
4. Login with `admin` / `Admin123!` or register new user

Enjoy! 🎉
