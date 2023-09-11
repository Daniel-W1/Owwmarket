import React from "react";
import { Link, useParams, useLocation  } from "react-router-dom";

const Navbar = ({ user, shops }) => {
    const pathname = useLocation()
    const params = useParams()
    const routes = [
        {
            href: `/dashboard/shop/${params.shopId}/settings`,
            label: "Settings",
            active: pathname === `/${params.shopId}/settings`
        }
    ]

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div>
                    select
                </div>
                <nav className="flex items-center space-x-4 lg-space-x-6">
                    {routes.map((route) => (
                        <Link key={route.href} href={route.href} className={`text-sm font-meduim transition-colors hover:text-primary ${route.active ? "text-black" : "text-muted-foreground"}`}>
                        {route.label}</Link>
                    ))}
                </nav>
            </div>
        </div>
    )

}
export default Navbar;