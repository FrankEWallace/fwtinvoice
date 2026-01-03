# FWT Invoice Generator

A professional, fully-featured invoice template generator built with React, TypeScript, and Vite. Create, edit, save, and download beautiful PDF invoices for your business.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF)

 Features

- Fully Editable Template - Edit all invoice fields including client info, dates, items, and tax
-  Dynamic Line Items - Add/remove multiple services or products
-  Auto-Save & Manual Save - Saves to browser localStorage every 30 seconds
-  PDF Download - High-quality PDF generation with custom filenames
- Print Support - Print directly or save as PDF via browser
-  Keyboard Shortcuts - Fast workflow with Ctrl+S, Ctrl+E, Ctrl+P
-  Professional Design - Clean, modern UI with F.W Technologies branding
- Auto-Calculations- Automatic subtotal, tax, and total calculations
-  Responsive Layout - Works on all screen sizes
-  Print-Optimized - Clean print layout without UI elements

 Quick Start

 Installation

```bash
# Clone the repository
git clone https://github.com/FrankEWallace/fwtinvoice.git

# Navigate to project directory
cd fwtinvoice

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:3000` (or the next available port).

### Build for Production

```bash
npm run build
```

##  Usage

### Creating an Invoice

1. **Edit Mode** - Click "Edit" to enter edit mode
2. **Fill Details** - Enter client name, business type, and location
3. **Add Items** - Click "Add Item" to add services/products
4. **Set Tax** - Enter tax percentage if applicable
5. **Preview** - Click "Preview" to see the final invoice
6. **Download** - Click "Download PDF" to save

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save invoice to browser storage |
| `Ctrl+E` | Toggle Edit/Preview mode |
| `Ctrl+P` | Open print dialog |

### Managing Invoices

- **Save** - Manually save your work (also auto-saves every 30s)
- **Load** - Restore previously saved invoice
- **New Invoice** - Create a new invoice with auto-incremented number
- **Download PDF** - Generate and download high-quality PDF
- **Print** - Print or save as PDF via browser dialog

##  Tech Stack

- **Frontend Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite 6.3.5
- **UI Components:** Radix UI + Custom Components
- **Styling:** Tailwind CSS
- **PDF Generation:** html2pdf.js
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
- **Storage:** Browser localStorage

##  Project Structure

```
fwtinvoice/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── figma/       # Figma-specific components
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── INVOICE_TEMPLATE_GUIDE.md  # Detailed user guide
└── package.json
```

##  Features in Detail

### Invoice Fields
- Invoice number (auto-incrementing)
- Issue date and due date
- Client information (name, type, location)
- Multiple line items with descriptions
- Quantity and rate per item
- Adjustable tax rate
- Auto-calculated totals

### PDF Generation
- High-quality output (A4 format)
- Dynamic filenames with date and client name
- Optimized for printing
- Professional layout

### Data Persistence
- Auto-save every 30 seconds
- Manual save option
- Browser localStorage
- Load previous invoices

##  Customization

To customize company information, edit the "From" section in `src/App.tsx`:

```tsx
<div>
  <h3>From</h3>
  <p>Your Company Name</p>
  <p>Your Business Type</p>
  <p>Your Location</p>
  <p>your-email@example.com</p>
  <p>+123 456 789</p>
</div>
```

##  License

This project is licensed under the MIT License.

##  Author

**Frank Wallace**
- GitHub: [@FrankEWallace](https://github.com/FrankEWallace)
- Email: wellikana@gmail.com

##  Acknowledgments

- Original design concept from Figma
- Built with [Vite](https://vitejs.dev/)
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)

##  Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on GitHub.

##  Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Made with ❤️ by F.W Technologies**
  
