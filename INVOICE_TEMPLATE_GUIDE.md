# Invoice Template Generator - User Guide

## 🎉 Features

Your invoice application is now a **fully editable template** that you can use for all your invoices!

### ✏️ **Editable Fields**

1. **Invoice Header**
   - Invoice Number (auto-increments with "New Invoice")
   - Date
   - Due Date

2. **Client Information**
   - Client Name
   - Business Type
   - Location

3. **Invoice Items**
   - Description
   - Details/Notes
   - Quantity
   - Rate (in TZS)
   - Amount (auto-calculated)

4. **Tax & Totals**
   - Adjustable tax rate (%)
   - Auto-calculated subtotal, tax, and total

---

## 🎯 How to Use

### **Creating a New Invoice**

1. **Edit Mode** - Click the "✏️ Edit" button or press `Ctrl+E` to enter edit mode
2. **Fill in Client Details** - Enter client name, type, and location
3. **Add/Edit Items**:
   - Edit existing items or click "Add Item" to add more
   - Remove items by clicking the trash icon
4. **Set Tax Rate** - Enter the tax percentage if applicable
5. **Preview** - Click "👁️ Preview" to see the final invoice

### **Managing Invoices**

| Action | Button | Keyboard Shortcut |
|--------|--------|-------------------|
| Save Draft | 💾 Save | `Ctrl+S` |
| Load Saved | 📂 Load | - |
| New Invoice | 📄 New Invoice | - |
| Toggle Edit | ✏️ Edit / 👁️ Preview | `Ctrl+E` |
| Print | 🖨️ Print | `Ctrl+P` |
| Download PDF | ⬇️ Download PDF | - |

---

## 💾 **Auto-Save Feature**

- Your invoice is **automatically saved every 30 seconds** to your browser's local storage
- Manual save available with the "Save" button or `Ctrl+S`
- Last saved time is displayed at the top

---

## 📥 **Download Options**

### **Option 1: Direct PDF Download**
1. Click "Download PDF" button
2. PDF is automatically generated and downloaded
3. Filename format: `FWT-XXX_Invoice_ClientName_YYYY-MM-DD.pdf`

### **Option 2: Print to PDF**
1. Click "Print" button
2. In the print dialog, select "Save as PDF"
3. Works in all modern browsers

---

## 🎨 **Invoice Features**

✅ Professional design with F.W Technologies branding  
✅ Multiple line items support  
✅ Auto-calculated totals  
✅ Editable tax rate  
✅ Clean print layout (buttons hidden when printing)  
✅ High-quality PDF output (A4 format)  
✅ Auto-incrementing invoice numbers  
✅ Browser storage for drafts  
✅ Toast notifications for user feedback  

---

## 💡 **Tips**

- **Multiple Items**: Add as many services/products as needed
- **Tax Rate**: Enter 0 for tax-free invoices, or any percentage (e.g., 18 for 18% VAT)
- **Date Ranges**: Due date defaults to 30 days from invoice date
- **Invoice Numbers**: Format is FWT-001, FWT-002, etc. (auto-increments with "New Invoice")
- **Browser Storage**: Invoices are saved locally - they won't be accessible from other devices
- **Keyboard Shortcuts**: Use shortcuts for faster workflow

---

## 🔧 **Technical Details**

- **Framework**: React + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **PDF Generation**: html2pdf.js
- **Storage**: Browser localStorage
- **Notifications**: Sonner toast library

---

## 🚀 **Workflow Example**

1. Open the app → Auto-loads last saved invoice (if any)
2. Click "New Invoice" → Creates fresh invoice with next number
3. Fill in client details and items
4. Click "Preview" → See how it looks
5. Click "Download PDF" → Get the PDF file
6. Click "New Invoice" → Start next invoice

---

## 📞 **Company Information**

The "From" section contains your company details:
- **Company**: F.W Technologies
- **Email**: wellikana@gmail.com
- **Phone**: +255 764 357699
- **Location**: Dar es Salaam, Tanzania

*To change these details, edit the code in `src/App.tsx`*

---

## ⚠️ **Important Notes**

- Data is stored in your browser's localStorage
- Clearing browser data will delete saved invoices
- For permanent storage, always download PDFs
- Works offline after initial load

---

**Enjoy creating professional invoices! 🎊**
