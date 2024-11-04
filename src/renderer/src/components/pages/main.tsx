import { IconLayoutDashboard, IconRosetteDiscountCheck, IconSettings, IconArrowLeft, Icon2fa, IconId } from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar'
import { Link } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import '../../global.css'
import SAKIcon from '../../assets/icon.png'

function MainPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* {open && <Logo />} */}
            <div className='mt-8 flex flex-col gap-2'>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink link={{
              label: 'Smiggy',
              href: '#',
              icon: (
                <img src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50} height={50} alt="Avatar" />
              )
            }} />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  )
}

const links = [
  {
    label: "Dashboard",
    href: "#",
    icon: (
      <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: 'Admin',
    href: '#',
    icon: (
      <IconId className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    )
  },
  {
    label: "Validator",
    href: "#",
    icon: (
      <IconRosetteDiscountCheck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

export const Logo = () => {
  return (
    <Link href="#" className='flex-shrink-0'>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium"
      >
        DEFSAK
      </motion.span>
    </Link>
  );
};


// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((i) => (
            <div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((i) => (
            <div
              key={"second-array" + i}
              className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage
