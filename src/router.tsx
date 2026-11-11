import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";
import { GuestOnly, RequireAuth } from "@/components/auth/RequireAuth";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/Skeleton";
import HomePage from "@/pages/HomePage";

// Home ships in the main bundle for a fast first paint; the rest load on demand.
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));

function PageFallback() {
  return (
    <div className="container-nova flex flex-col gap-6 pt-16" role="status">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-16 w-1/2" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}

const page = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: page(<ShopPage />) },
      { path: "product/:id", element: page(<ProductPage />) },
      { path: "cart", element: page(<CartPage />) },
      {
        path: "checkout",
        element: page(
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>,
        ),
      },
      {
        path: "account",
        element: page(
          <RequireAuth>
            <AccountPage />
          </RequireAuth>,
        ),
      },
      {
        path: "login",
        element: page(
          <GuestOnly>
            <LoginPage />
          </GuestOnly>,
        ),
      },
      {
        path: "signup",
        element: page(
          <GuestOnly>
            <SignupPage />
          </GuestOnly>,
        ),
      },
      {
        path: "forgot-password",
        element: page(
          <GuestOnly>
            <ForgotPasswordPage />
          </GuestOnly>,
        ),
      },
      { path: "wishlist", element: page(<WishlistPage />) },
      { path: "search", element: page(<SearchPage />) },
      { path: "*", element: page(<NotFoundPage />) },
    ],
  },
]);
