import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './pages/HomePage/HomePage'
import { EventPage } from './pages/EventPage/EventPage'
import { AddEventPage } from './pages/AddEventPage/AddEventPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/add" element={<AddEventPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
