'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth='120vw'>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = 'description' content="Create flashcard from your text"></meta>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style = {{flexGrow: 1}}> Flashcard SaaS</Typography>
            <SignedOut>
              <Button color = "inherit" href="sign-in"> Login </Button>
              <Button color="inherit" href="sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton/>
            </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx = {{
        textAlign : 'center', 
        my : 4
      }}>
        <Typography variant="h2" style = {{flexGrow: 1 }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5">
          Easy way to make flashcards
        </Typography>
        <Button variant="contained" color = "primary" sx = {{mt: 2}} href = "generate">
            Get started
        </Button>
      </Box>
      {/* -----------------------------Features Section -------------------------- */}
      <Box sx = {{my : 6}}> 
      <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md = {4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>Simply Input your topic and let our software do the rest. Creating flashcard has never been easier</Typography>
          </Grid>
          <Grid item xs={12} md = {4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>Simply Input your topic and let our software do the rest. Creating flashcard has never been easier</Typography>
          </Grid>
          <Grid item xs={12} md = {4}>
            <Typography variant="h6">Accesiable Anywhere</Typography>
            <Typography>Simply Input your topic and let our software do the rest. Creating flashcard has never been easier</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* -----------------------------Pricing section ------------------------------------ */}
      <Box sx = {{ my: 6, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md = {6}>
            <Box sx = {{
              border : '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2
            }}>
              <Typography variant="h5" gutterBottom sx={{mt:2}}>Basic Plan</Typography>
              <Typography variant="h6" gutterBottom >$5 / Month</Typography>
              <Typography >Access basic Features and limited storage</Typography>
              <Button variant="contained" color = "primary" sx = {{mt: 2, mb: 2}} gutterBottom>Choose basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md = {6}>
          <Box sx = {{
              border : '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2
            }}>
             <Typography variant="h5" gutterBottom sx = {{mt:2}}>Pro Plan</Typography>
              <Typography variant="h6" gutterBottom >$10 / Month</Typography>
              <Typography >Access pro Features and unlimited storage</Typography>
              <Button variant="contained" color = "primary" sx = {{mt: 2, mb: 2}} gutterBottom onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
