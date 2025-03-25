import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Github } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center p-4 bg-neutral-800 text-white '>
        <h1 className='text-2xl font-bold'>LittleURL</h1>
        <ul className='flex flex-row gap-4 items-center'>
            <Link href={"/"}><li>Home</li></Link>
            <Link href={"/"}><li>Contact</li></Link>
            <Link href={"/"}><li>About</li></Link>
            <Link href={"/generate"}><Button asChild variant={"secondary"}><li>Shorten URL</li></Button></Link>
            <Link href={"/github"} className='border rounded-full p-1'><li className=''><Github size={24}/></li></Link>
        </ul> 
    </nav>
  )
}

export default Navbar