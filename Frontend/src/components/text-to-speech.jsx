'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Download, ChevronDown, Pause, Loader2 } from "lucide-react"
import { BsTranslate } from "react-icons/bs";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";
import { IoIosMusicalNotes } from "react-icons/io";
import { MdOutlineGTranslate } from "react-icons/md";
import { RiUserVoiceFill } from "react-icons/ri";
import { MdKeyboardVoice } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { audioData } from '@/data/audio_data';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TextToSpeechExact() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState("")
  const [audioFiles, setAudioFiles] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const audioRef = useRef(null)
  // Fetch audio files from your FastAPI backend
  useEffect(() => {
    const fetchAudioFiles = async () => {
      setAudioFiles(audioData);
      setText(audioData[0].text);
      setSelectedLanguage(audioData[0].language);
    }

    fetchAudioFiles()
  }, [])

  // Handle language selection and play audio
  const handleLanguageChange = async (languageTitle) => {
    setSelectedLanguage(languageTitle)
    setIsLoading(true)

    try {
      // Find the audio file that matches the selected language
      const audioFile = audioFiles.find(file =>
        file.language.toLowerCase() === languageTitle.toLowerCase()
      )

      if (audioFile) {
        setText(audioFile.text)
        setCurrentAudioUrl(audioFile.url)


        // Wait a bit for the audio ref to update, then play
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load() // Reload the audio element
            // .then(() => {
            //   setIsPlaying(true)
            // })
            // .catch(error => {
            //   console.error('Error playing audio:', error)
            // })
          }
        }, 100)
      } else {
        console.error('Audio file not found for language:', languageTitle)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !currentAudioUrl) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(error => {
          console.error('Error playing audio:', error)
        })
    }
  }

  const handleDownload = async () => {
    if (!currentAudioUrl) return;

    try {
      const response = await fetch(currentAudioUrl, { mode: 'cors' }); // Ensure CORS
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedLanguage || 'audio'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    }
  };


  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    const handlePause = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [currentAudioUrl])

  return (
    <div className="px-40">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        {currentAudioUrl && <source src={currentAudioUrl} type="audio/mpeg" />}
      </audio>

      {/* Tab Navigation */}
      <div className="bg-white">
        <div className="max-w-9xl mx-auto px-4">
          <div className="flex items-center space-x-1 py-4">

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <BsTranslate />
              <span className="font-sm text-sm ">TEXT TO SPEECH</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <MdOutlineSupervisedUserCircle />
              <span className="font-medium text-sm font-bold">AGENTS</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <IoIosMusicalNotes />
              <span className="font-medium text-sm font-bold" >MUSIC</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <MdOutlineGTranslate />
              <span className="font-medium text-sm font-bold">SPEECH TO TEXT</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <MdKeyboardVoice />
              <span className="font-medium text-sm font-bold">DUBBING</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <RiUserVoiceFill />
              <span className="font-medium text-sm font-bold">VOICE CLONING</span>
            </Button>

            <Button className="flex items-center space-x-2 px-2 bg-white text-gray hover:border border hover:bg-white hover:border-black py-2 active:bg-gray-300 active:text-black cursor-pointer rounded-lg">
              <FaBookReader />
              <span className="font-medium text-sm font-bold">ELEVENREADER</span>
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-gray-100 border rounded-2xl p-1'>
        <div className='rounded-2xl bg-white border pb-2'>
          <textarea disabled
            className="w-full h-48 p-4 rounded-lg text-gray-800 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
          />
          <div className="px-4 pb-2">
            <div className="flex flex-wrap text-black items-center space-x-1 pt-4">

              <Button className="flex items-center m-1 rounded-lg space-x-2 px-2 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">Samara</span>
                <span className="font-sm text-sm font-bold">Narrate a story</span>
              </Button>

              <Button className="flex items-center rounded-lg space-x-2 px-2 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">2-speakers</span>
                <span className="font-sm text-sm font-bold">Create a dialogue</span>
              </Button>

              <Button className="flex items-center rounded-lg space-x-2 px-4 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">Announcer</span>
                <span className="font-sm text-sm font-bold">Voiceover a game</span>
              </Button>

              <Button className="flex items-center rounded-lg space-x-2 px-4 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">Sergeant</span>
                <span className="font-sm text-sm font-bold">Play a drill sergeant</span>
              </Button>

              <Button className="flex items-center rounded-lg space-x-2 px-4 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">Spuds</span>
                <span className="font-sm text-sm font-bold">Recount an old story</span>
              </Button>

              <Button className="flex items-center rounded-lg space-x-2 px-4 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black">
                <span className="font-sm text-sm font-bold border-r pr-2">Jessica</span>
                <span className="font-sm text-sm font-bold">Provide customer support</span>
              </Button>

            </div>
          </div>

          <div className='flex justify-between bt-1 mx-2 border-t pt-3'>
            <Select onValueChange={handleLanguageChange} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isLoading ? "Loading..." : "Select a Language"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Languages</SelectLabel>
                  {audioFiles.map((audioFile) => (
                    <SelectItem key={audioFile.id} value={audioFile.language}>
                      {audioFile.language}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              {/* Current playing indicator */}


              <Button
                onClick={togglePlayPause}
                disabled={!currentAudioUrl || isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>

              <Button
                className='bg-white border rounded-xl ml-2 text-black hover:bg-white'
                onClick={handleDownload}
                disabled={!currentAudioUrl}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>

        </div>

        <div className='flex justify-center text-black h-16 items-center'>
          <p className='font-bold'>Powered by Eleven v3 (alpha)</p>
        </div>

      </div>

      <div className='flex justify-center gap-3 my-5 items-center'>
        <p className='text-black'>Experience the full Audio AI platform</p>
        <Button className="rounded-3xl cursor-pointer">SIGN UP</Button>
      </div>

    </div>
  )
}
