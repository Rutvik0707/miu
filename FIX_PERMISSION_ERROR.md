# 🔧 Fix Permission Error - Quick Guide

## ❌ Error You're Seeing:

```
Error: EPERM: operation not permitted, open 'D:\smart contract deployer\miu\miu\.next\trace'
```

## ✅ Solution: Close Node Process & Delete .next Folder

### Method 1: Using Task Manager (Easiest)

1. **Press `Ctrl+Shift+Esc`** to open Task Manager
2. **Find "Node.js"** processes
3. **Right-click** each Node.js process
4. **Click "End Task"**
5. **Close Task Manager**

Then in your terminal:
```bash
cd "d:\smart contract deployer\miu\miu"
rm -rf .next
npm run dev
```

### Method 2: Using Command Prompt

1. **Open Command Prompt as Administrator**
   - Press `Win+X`
   - Click "Command Prompt (Admin)" or "PowerShell (Admin)"

2. **Run these commands:**
```cmd
cd "d:\smart contract deployer\miu\miu"
taskkill /F /IM node.exe
rmdir /S /Q .next
npm run dev
```

### Method 3: Manual Deletion

1. **Close your IDE/terminal** (close VS Code completely)
2. **Open File Explorer**
3. **Navigate to:** `D:\smart contract deployer\miu\miu`
4. **Find the `.next` folder**
5. **Right-click → Delete**
   - If it says "file in use", restart your computer
6. **Reopen VS Code**
7. **Run:**
```bash
npm run dev
```

### Method 4: Restart Computer (If all else fails)

1. **Save all your work**
2. **Restart your computer**
3. **Open VS Code**
4. **Navigate to project:**
```bash
cd "d:\smart contract deployer\miu\miu"
```
5. **Delete .next folder:**
```bash
rm -rf .next
```
6. **Start server:**
```bash
npm run dev
```

## 🎯 After Fixing

Once the server starts successfully, you should see:
```
✓ Ready on http://localhost:3000
```

Then test WalletConnect:
1. Open http://localhost:3000
2. Click "Connect wallet"
3. Click "WalletConnect"
4. Click "Trust Wallet"
5. QR modal should appear!

## 🔍 Why This Happens

The `.next` folder contains Next.js build cache. Sometimes:
- Node process doesn't close properly
- Files get locked by the system
- Permission issues occur

**Solution:** Delete the folder and let Next.js recreate it.

## ⚠️ Important

**DO NOT delete anything else!** Only delete the `.next` folder.

The `.next` folder is safe to delete because:
- ✅ It's automatically generated
- ✅ Next.js recreates it on startup
- ✅ Contains only build cache
- ✅ No source code inside

## 📋 Quick Checklist

- [ ] Close all Node.js processes (Task Manager)
- [ ] Delete `.next` folder
- [ ] Run `npm run dev`
- [ ] Server starts successfully
- [ ] Open http://localhost:3000
- [ ] Test WalletConnect

---

**Choose the method that works best for you and try again!** 🚀
