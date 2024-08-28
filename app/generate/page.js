'use client';  // Add this line to indicate that this is a Client Component

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardActionArea,
} from '@mui/material'
import { collection, writeBatch, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; 
import { useState } from "react";




export default function Generate(){
    const {isloaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }

      const handleOpen = () => {
        setOpen(true)
      }
      const handleClose = () => {
        setOpen(false)
      }
      const saveFlashcards = async () => {
        if (!name){
          alert('Please enter Name')
          return
        }
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSanp = await getDoc(userDocRef)
    
        if (docSanp.exists()){
          const collections = docSanp.data().flashcards || []
          if (collections.find((f) => f.name === name)){
            alert('Flashcards collection already exists, choose a different name')
            return
          } else {
            collections.push({name})
            batch.set(userDocRef, {flashcards: collections}, {merge: true})
          }
        } else {
          batch.set(userDocRef, { flashcardSets: [{ name: name }] })  
        }
    
        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
          const cardDocRef = doc(colRef)
          batch.set(cardDocRef, flashcard)
        })
    
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }
    return(
      <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      {flashcards.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Generated Flashcards
        </Typography>
      <Grid container spacing={3}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea onClick={() => {
              handleCardClick(index)
            }}>
              <CardContent>
                <Box sx = {{
                  perspective: '1000px',
                  borderRadius: '10px',
                  '& > div': {
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                    transform: flipped[index]? 'rotateY(180deg)':'rotateY(0deg)',
                  },
                  '& > div > div': {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    boxSizing: 'border-box' 
                  },
                  '& > div > div:nth-of-type(2)': {
                    transform: 'rotateY(180deg)',
                  }
                }}>
                  <div>
                    <div>
                    <Typography variant="h6" component={"div"}>{flashcard.front}</Typography>
                    </div>
                    <div>
                    <Typography variant="h6" component={"div"}>{flashcard.back}</Typography>
                    </div>
                  </div>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          
        </Grid>
      ))}
      </Grid>
      <Box sx = {{mt: 4, display: 'flex', justifyContent: 'center'}}>
        <Button variant="contained" color = "secondary" onClick={handleOpen}>
              Save Flashcards
        </Button>
      </Box>
      </Box>  
      )}

      <Dialog open = {open} onClose = {handleClose}>
        <DialogTitle>
          Save Flashcards Set
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard collections 
          </DialogContentText>
          <TextField autoFocus 
          margin="dense" 
          label="Collection Name" 
          type = "text"
          fullWidth
          value = {name}
          onChange = {(e) => setName(e.target.value)}
          variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
      
    </Container>
    )

}