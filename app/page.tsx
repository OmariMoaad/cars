import { AppSidebar } from "@/components/app-sidebar";
import { CarTable } from "@/components/car-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Home() {
   return (
     <SidebarProvider>
       <AppSidebar />
       <SidebarInset>
         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
           <SidebarTrigger className="-ml-1" />
           <Separator orientation="vertical" className="mr-2 h-4" />
           <p>
            Cars
           </p>
         </header>
         <div className="flex flex-1 flex-col gap-4 p-4">
          <CarTable />
           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
             
           </div>
           <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
         </div>
       </SidebarInset>
     </SidebarProvider>
   );
}
