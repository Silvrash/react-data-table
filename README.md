# Advanced Customizable Table Component for Next.js

This Next.js project showcases a highly advanced customizable table component that you can easily integrate into your web applications. The table component offers a wide range of features and customization options to suit your specific needs.

## Features

- **Customizable Columns:** Easily define and customize the columns to display in the table.
- **Sorting:** Sort data in ascending or descending order by clicking on column headers.
- **Pagination:** Split large datasets into manageable pages for better user experience.
- **Search:** Quickly search for specific data within the table.
- **Resizable Columns:** Resize columns to fit your content perfectly.
- **Custom Styling:** Customize the table's appearance to match your application's design.
- **Server-Side Rendering (SSR):** Designed to work seamlessly with Next.js SSR.

## Getting Started

To use this advanced customizable table component in your Next.js project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Silvrash/react-data-table.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-data-table
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the example usage of the customizable table component.

## Usage

To integrate the table component into your Next.js project, follow these steps:

1. For Remote data fetching, check usage at [RemoteData.tsx](./app/RemoteData.tsx)
2. For a fixed data set, check usage at [FixedData](./app/FixedData.tsx)
3. Customize the styling of the table to match your application's design.
4. Or you can copy `./components/data-table/hooks/useDataTable.tsx` and build your own React Table Component 

## Acknowledgments

- [@tanstack/react-table](https://tanstack.com/table/v8): For the foundational table component that inspired this project.

- [Next.js](https://nextjs.org/): For providing a powerful framework for building modern web applications with React.
