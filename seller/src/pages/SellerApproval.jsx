import "./SellerApproval.css";


function SellerApproval() {
  return (
    <main className="seller-content seller-approval-page">
      <div className="seller-approval-card">
        <div className="seller-approval-icon">
          ⏳
        </div>

        <h1>Shop Approval Pending</h1>

        <p>
          Your shop registration has been submitted successfully.
        </p>

        <p>
          Our admin team is reviewing your shop. You will get
          access to the seller dashboard once your shop is approved.
        </p>

        <div className="seller-approval-status">
          <span className="status-dot"></span>
          Waiting for Admin Approval
        </div>
      </div>
    </main>
  );
}

export default SellerApproval;