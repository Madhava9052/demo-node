"use client"
import React from 'react'
import { useState } from 'react';
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import ReviewDetails from './ReviewDetails'

function ProvideDesign() {
  const [step, setStep] = useState(1)

  const toggleStep =(param) =>{
    if(param === 'increase') {
      setStep(step + 1)
    }
    else if(param === 'decrease'){
      setStep(step - 1)
    }
   
  }

  function showStep(step) {
    switch (step) {
      case 1:
        return <FirstStep toggleStep={toggleStep}/>
      case 2:
        return <SecondStep toggleStep={toggleStep}/>
      case 3:
        return <ThirdStep toggleStep={toggleStep}/>
      case 4:
        return <ReviewDetails toggleStep={toggleStep}/>
    }
  }

  return (
    <div>
      {showStep(step)}
    </div>
  )
}

export default ProvideDesign