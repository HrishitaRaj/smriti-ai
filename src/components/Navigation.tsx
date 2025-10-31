import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            Smriti
          </div>
          
          <div className="flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#home" className="px-4 py-2 text-foreground hover:text-primary transition-colors">
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-background">
                      <li>
                        <NavigationMenuLink href="#memory-journal" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Memory Journal</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Capture and preserve precious moments
                          </p>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/chat" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div>
                              <div className="text-sm font-medium leading-none">Store and Recall</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                AI-powered memory retrieval system
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/activities" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div>
                              <div className="text-sm font-medium leading-none">Daily Activities</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Step-by-step daily routines and timelines
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#caregiver-dashboard" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Caregiver Dashboard</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Track progress and insights
                          </p>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="#emotion-tracker" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Emotion Tracker</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Monitor emotional well-being
                          </p>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        {/* Use react-router Link as child so navigation is SPA-friendly */}
                        <NavigationMenuLink asChild>
                          <Link to="/emotion-tracker" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Emotion Tracker</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Monitor emotional well-being
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/visualgallery" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div>
                              <div className="text-sm font-medium leading-none">Visual Gallery</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse visual memories and photos
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink href="#benefits" className="px-4 py-2 text-foreground hover:text-primary transition-colors">
                    Benefits
                  </NavigationMenuLink>
                </NavigationMenuItem>

                

                <NavigationMenuItem>
                  <NavigationMenuLink href="#contact" className="px-4 py-2 text-foreground hover:text-primary transition-colors">
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sign In
              </Button>
              <Button className="bg-gradient-primary text-white shadow-glow hover:shadow-soft transition-all duration-300">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
