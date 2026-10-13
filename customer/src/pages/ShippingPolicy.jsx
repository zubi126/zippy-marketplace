
import "./InfoPage.css";

function ShippingPolicy() {
  const lastUpdated = "13 October 2026";

  return (
    <main className="info-page">
      <div className="info-page-header">
        <span className="info-eyebrow">MYKASHO POLICIES</span>
        <h1>Shipping & Delivery Policy</h1>
        <p>
          Everything you need to know about order
          processing, delivery and tracking on MyKasho.
        </p>
        <p>
          <strong>Last updated:</strong> {lastUpdated}
        </p>
      </div>

      <section className="info-card">
        <h2>1. Delivery Coverage</h2>
        <p>
          MyKasho connects customers with participating
          local shops. Delivery is available only in
          locations currently supported by the platform
          and the relevant seller or delivery service.
        </p>
        <p>
          Available delivery locations may expand as
          more shops and delivery partners join MyKasho.
          Please enter your delivery address at checkout
          to check whether service is available.
        </p>

        <h2>2. Order Processing</h2>
        <p>
          After an order is placed, it may need to be
          confirmed by the relevant seller before
          preparation begins. Processing time depends
          on product availability, seller operating
          hours and order volume.
        </p>
        <p>
          An order confirmation does not necessarily
          mean that the order has been dispatched.
          Check the order status for the latest update.
        </p>

        <h2>3. Delivery Estimates</h2>
        <p>
          Any estimated delivery time displayed during
          checkout or order tracking is an estimate.
          Actual delivery may vary due to seller
          preparation, rider availability, weather,
          traffic, address details and other factors.
        </p>
        <p>
          If a significant delay occurs, contact
          MyKasho support with your order number for
          assistance.
        </p>

        <h2>4. Delivery Charges</h2>
        <p>
          Applicable delivery charges, service fees
          and other order charges will be shown during
          checkout before you confirm your order.
          Charges may vary by delivery location,
          seller, order or applicable offer.
        </p>
        <p>
          Please review the final order summary before
          placing your order.
        </p>

        <h2>5. Order Tracking</h2>
        <p>
          Where tracking is available, customers can
          check order progress through their MyKasho
          account or the order details page.
          Updates may include order confirmation,
          preparation, dispatch and delivery status,
          depending on the available workflow.
        </p>

        <h2>6. Accurate Delivery Information</h2>
        <p>
          Customers should provide a complete and
          accurate delivery address, PIN code and
          reachable phone number. Include useful
          directions where necessary.
        </p>
        <p>
          Incorrect or incomplete information may
          delay delivery or prevent successful
          completion of the order.
        </p>

        <h2>7. Receiving Your Order</h2>
        <p>
          Please ensure that you or an authorized
          recipient is available at the delivery
          address. The recipient may need to confirm
          receipt of the order.
        </p>
        <p>
          If an item appears damaged, incorrect or
          missing, report the issue to MyKasho support
          as soon as reasonably possible and retain
          relevant packaging or evidence where available.
        </p>

        <h2>8. Failed Delivery</h2>
        <p>
          Delivery may fail if the recipient is
          unavailable, the address cannot be located,
          contact details are incorrect or access
          to the delivery location is not possible.
        </p>
        <p>
          If delivery cannot be completed, MyKasho
          or the delivery partner may contact the
          customer to discuss the available next steps.
          Any redelivery, cancellation or refund will
          follow the applicable order policies.
        </p>

        <h2>9. Delays and Unforeseen Events</h2>
        <p>
          Delivery may be affected by severe weather,
          road closures, local restrictions, operational
          disruptions or other circumstances beyond
          reasonable control. We will provide available
          updates where possible.
        </p>

        <h2>10. Cancellations and Refunds</h2>
        <p>
          Requests to cancel an order and any
          associated refund are governed by the
          MyKasho Cancellation Policy and Refund Policy.
          Cancellation may not be possible after certain
          preparation or dispatch stages, subject to
          applicable law and the relevant policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          For delivery questions or assistance, use
          the Contact Us page on MyKasho and provide
          your order number. Official support contact
          details will be published before public launch.
        </p>
      </section>
    </main>
  );
}

export default ShippingPolicy;
