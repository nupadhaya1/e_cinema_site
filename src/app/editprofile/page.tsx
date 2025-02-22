//Registered user must be able to view and modify their user profile at any time. They may also change their password. However, users cannot change their email address.
//The system must allow web users to register for the system. To register, users should provide their password, personal information (name, phone number, email address, and password). 
///They might optionally, provide payment information (card type, number, and expiration date, and billing address) and home address info (street, city, state and zip code).
//Users can provide only one shipping address and a maximum of three payments cards.
//Registered users can subscribe/unsubscribe for promotions and offered by the system administrator.
"use client"

import EditProfileForm from "~/components/editProfile"


export default function ProfilePage() {

  return (
    <EditProfileForm></EditProfileForm>
  )
}

