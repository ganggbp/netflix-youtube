import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  addDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState([]);

  useEffect(() => {
    async function getSubscription() {
      const customerRef = doc(collection(db, "customers"), user.uid);
      const customerDoc = await getDoc(customerRef);

      const subscriptionsSnapshot = await getDocs(
        collection(customerDoc.ref, "subscriptions")
      );
      subscriptionsSnapshot.docs.forEach((subscriptions) => {
        const { role, current_period_end, current_period_start } =
          subscriptions.data();

        setSubscription({
          role,
          current_period_start: current_period_start.seconds,
          current_period_end: current_period_end.seconds,
        });
      });
    }

    getSubscription();
  }, [user.uid]);

  useEffect(() => {
    async function getProduct() {
      const products = {};
      const q = query(collection(db, "products"), where("active", "==", true));
      const productSnapShot = await getDocs(q);
      productSnapShot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();

        const priceSnapshot = await getDocs(
          collection(productDoc.ref, "prices")
        );
        priceSnapshot.docs.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });

      setProducts(products);
    }

    getProduct();
  }, []);

  const loadCheckOut = async (priceId) => {
    const customerRef = doc(collection(db, "customers"), user.uid);
    const checkoutSessionRef = collection(customerRef, "checkout_sessions");

    const docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        //Show an error to your customer and inspect your Cloud function logs in the firebase console
        alert(`An error occured: ${error.message}`);
      }

      if (sessionId) {
        // we have a session, let's redirect to Checkout
        // init stripe
        const stripe = await loadStripe(
          "pk_test_51MVyNKFNpvIt6n1YHv9FV62TXftG0xkoepnXZXERfN6afLMBwETDO7MO7i3Oxvsv4iZ4M0M84a0FbRZ0IdhOkK8M00Dx086S9S"
        );

        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className='plansScreen'>
      <br />
      {subscription ? (
        <p>
          Renewable date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      ) : null}

      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            key={productId}
            className={`plansScreen__plan ${
              isCurrentPackage && "plansScreen__plan--disabled"
            }`}
          >
            <div className='plansScreen__info'>
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() => {
                !isCurrentPackage && loadCheckOut(productData.prices.priceId);
              }}
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
