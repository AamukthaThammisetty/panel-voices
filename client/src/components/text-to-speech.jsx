'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Download, Pause, Loader2 } from "lucide-react"
import { BsTranslate } from "react-icons/bs";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";
import { IoIosMusicalNotes } from "react-icons/io";
import { MdOutlineGTranslate } from "react-icons/md";
import { RiUserVoiceFill } from "react-icons/ri";
import { MdKeyboardVoice } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { audioData } from '@/data/audio_data';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const navigationItems = [
  {
    id: 'text-to-speech',
    icon: BsTranslate,
    label: 'TEXT TO SPEECH'
  },
  {
    id: 'agents',
    icon: MdOutlineSupervisedUserCircle,
    label: 'AGENTS'
  },
  {
    id: 'music',
    icon: IoIosMusicalNotes,
    label: 'MUSIC'
  },
  {
    id: 'speech-to-text',
    icon: MdOutlineGTranslate,
    label: 'SPEECH TO TEXT'
  },
  {
    id: 'dubbing',
    icon: MdKeyboardVoice,
    label: 'DUBBING'
  },
  {
    id: 'voice-cloning',
    icon: RiUserVoiceFill,
    label: 'VOICE CLONING'
  },
  {
    id: 'elevenreader',
    icon: FaBookReader,
    label: 'ELEVENREADER'
  }
];

const options = [
  { id: "samara", label: "Samara", description: "Narrate a story" },
  { id: "two_speakers", label: "2-speakers", description: "Create a dialogue" },
  { id: "announcer", label: "Announcer", description: "Voiceover a game" },
  { id: "sergeant", label: "Sergeant", description: "Play a drill sergeant" },
  { id: "spuds", label: "Spuds", description: "Recount an old story" },
  { id: "jessica", label: "Jessica", description: "Provide customer support" }
];


export default function TextToSpeechExact() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const [currentTab, setCurrentTab] = useState(navigationItems[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState("")
  const [audioFiles, setAudioFiles] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://panel-voices.onrender.com/audio-files',
          {
            timeout: 5000,
          }
        )
        setAudioFiles(response.data.audio_files)
        setText(response.data.audio_files[0].text)
        setSelectedLanguage(response.data.audio_files[0].language)
        setCurrentAudioUrl(response.data.audio_files[0].url)
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setAudioFiles(audioData);
          setText(audioData[0].text);
          setSelectedLanguage(audioData[0].language);
          setCurrentAudioUrl(response.data.audio_files[0].url)
        } else {
          console.error("Error fetching data:", error.message);
        }
      } finally {
        setIsLoading(false);
      }

    }

    fetchAudioFiles()
  }, [])

  const handleLanguageChange = async (languageTitle) => {
    setSelectedLanguage(languageTitle)
    setIsLoading(true)

    try {
      const audioFile = audioFiles.find(file =>
        file.language.toLowerCase() === languageTitle.toLowerCase()
      )

      if (audioFile) {
        setText(audioFile.text)
        setCurrentAudioUrl(audioFile.url)
        setIsPlaying(false);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load()
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
      const response = await fetch(currentAudioUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedLanguage || 'audio'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

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
    <div>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        {currentAudioUrl && <source src={currentAudioUrl} type="audio/mpeg" />}
      </audio>

      <div className="w-full flex items-center justify-center px-4 flex-wrap space-x-1 py-2 space-y-0 gap-y-2">
        {navigationItems.map((item) => (
          <Button
            onClick={() => setCurrentTab(item.id)}
            variant="secondary"
            className={`flex items-center space-x-2 px-2 
              bg-white text-gray hover:border border hover:bg-white 
              hover:border-black py-2 active:bg-gray-300 active:text-black 
              cursor-pointer rounded-lg ${currentTab === item.id
                ? "text-black border border-black" // active state
                : ""
              }`}
          >
            <item.icon />
            <span className="font-medium text-xs font-bold">{item.label}</span>
          </Button>
        ))}
      </div>

      {currentTab == "text-to-speech" ?
        <div className='xl:max-w-screen-lg mx-auto bg-gray-100 border rounded-2xl p-1'
          style={{
            background: 'radial-gradient(ellipse at bottom right, #81d4fa, #ce93d8, #ff8a65, transparent 30%)'
          }}

        >
          <div className='rounded-2xl bg-white border pb-2'>
            {isLoading ? <div className="w-full h-48 p-4 rounded-lg text-gray-800 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div> : <textarea disabled
              className="w-full h-48 p-4 rounded-lg text-gray-800 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
            />
            }

            <div className="px-4 pb-2">
              <div className="flex flex-wrap text-black items-center space-x-1 pt-4">

                {options.map((option) => (
                  <Button
                    key={option.id}
                    id={option.id}
                    className="flex items-center m-1 rounded-lg space-x-2 px-2 py-2 bg-white text-gray hover:border border hover:bg-gray-100 active:bg-gray-300 cursor-pointer active:text-black"
                  >
                    <span className="font-sm text-sm border-r pr-2">{option.label}</span>
                    <span className="font-sm text-sm">{option.description}</span>
                  </Button>
                ))}

              </div>
            </div>

            <div className='flex justify-between bt-1 mx-2 border-t pt-3'>
              <Select onValueChange={handleLanguageChange} value={selectedLanguage} disabled={isLoading}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select a Language"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Languages</SelectLabel>
                    {audioFiles.map((audioFile) => (
                      <SelectItem key={audioFile.id} value={audioFile.language}>
                        {audioFile.language.toUpperCase()}
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

          <div className='flex justify-center text-black h-12 items-center'>
            <p className='font-semibold'>Powered by Eleven v3 (alpha)</p>
          </div>

        </div> :
        <div className="xl:max-w-screen-lg mx-auto bg-gray-100 border rounded-2xl p-1">
          <div className="rounded-2xl bg-white border flex flex-col items-center justify-center h-96 space-y-4 text-center px-4">
            <p className="text-2xl font-bold text-gray-600">Coming Soon</p>
            <p className="text-gray-600 max-w-md">
              This functionality is currently under development. Please try our
              <span className="font-semibold"> Text-to-Speech </span> feature in the meantime.
            </p>

            <Button
              onClick={() => setCurrentTab("text-to-speech")}
              variant="secondary"
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray 
                      hover:border border hover:bg-gray-50 hover:border-black 
                      active:bg-gray-300 active:text-black cursor-pointer rounded-lg"
            >
              <span className="font-medium text-sm font-bold">Go to Text-to-Speech</span>
            </Button>
          </div>
        </div>
      }

      <div className='flex justify-center gap-3 my-5 items-center'>
        <p className='text-black'>Experience the full Audio AI platform</p>
        <Button className="rounded-3xl cursor-pointer">SIGN UP</Button>
      </div>

    </div>
  )
}
