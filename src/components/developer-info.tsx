
'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Linkedin, Mail, UserCircle } from 'lucide-react';

export function DeveloperInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="text-white/70 hover:text-white">Know The Developer</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="developer avatar" alt="@subhu" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">SUBHU</h4>
            <p className="text-sm text-muted-foreground">
              A passionate developer creating amazing web experiences.
            </p>
            <div className="flex items-center pt-2 gap-4">
              <a href="mailto:subahsishnayak38@gmail.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://github.com/subhasish12345" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/subhasish-nayak-67a257280" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Portfolio">
                <UserCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
