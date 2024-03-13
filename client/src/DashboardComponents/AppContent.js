import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer lg>
     <p>fffffffffffffffffff</p>
    </CContainer>
  )
}

export default React.memo(AppContent)
