import './globals.css'
import { Inter } from 'next/font/google'
import 'katex/dist/katex.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rapid SAT Practice',
  description: 'Official SAT practice tests with Bluebook-style interface',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}