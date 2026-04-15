"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/">
           Electronia
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active fw-semibold" : ""}`}
                href="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/products") ? "active fw-semibold" : ""}`}
                href="/products"
              >
                Products
              </Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/products/add") ? "active fw-semibold" : ""}`}
                  href="/products/add"
                >
                  + Add Product
                </Link>
              </li>
            )}
          </ul>

          {/* Right — Auth */}
          <div className="d-flex align-items-center gap-3">
            {status === "loading" ? (
              <div className="spinner-border spinner-border-sm text-light" />
            ) : session ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="rounded-circle border border-light"
                    />
                  )}
                  <span className="text-light small">{session.user?.name}</span>
                </div>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
