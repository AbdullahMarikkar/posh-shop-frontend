import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, TextField, Button, Divider, Alert, 
  Stepper, Step, StepLabel, RadioGroup, FormControlLabel, Radio, CircularProgress 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { CheckCircleRounded, ArrowBackRounded, ShoppingBagOutlined, LockOutlined, LocalShippingOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { PaymentService } from '../api/payment.service';
import { UserService } from '../api/user.service';
import type { ShippingDetail } from '../types';

const steps = ['Shipping Details', 'Payment Method', 'Final Review'];

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const total = getCartTotal();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [awxDetails, setAwxDetails] = useState<{clientSecret: string, intentId: string, checkoutId: string} | null>(null);

  // Initialize Airwallex element on detail load
  useEffect(() => {
    if (awxDetails) {
      // @ts-ignore
      if (window.Airwallex) {
        // @ts-ignore
        window.Airwallex.init({
          env: import.meta.env.VITE_AIRWALLEX_ENV || 'demo',
          intent_id: awxDetails.intentId,
          client_secret: awxDetails.clientSecret,
        });
        // @ts-ignore
        const card = window.Airwallex.createElement('card');
        card.mount('airwallex-card-element');
      }
    }
  }, [awxDetails]);

  // Form States
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', postalCode: ''
  });

  const [savedAddresses, setSavedAddresses] = useState<ShippingDetail[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingAddresses(true);
      UserService.getShippingDetails(user.id)
        .then((data) => {
          if (data && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressIndex(0);
            setShipping({
              firstName: data[0].first_name,
              lastName: data[0].last_name,
              email: data[0].email,
              address: data[0].delivery_address,
              city: data[0].city,
              postalCode: data[0].postal
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [user]);

  const handleSelectAddress = (index: number) => {
    setSelectedAddressIndex(index);
    if (index >= 0) {
      const addr = savedAddresses[index];
      setShipping({
        firstName: addr.first_name,
        lastName: addr.last_name,
        email: addr.email,
        address: addr.delivery_address,
        city: addr.city,
        postalCode: addr.postal,
      });
    } else {
      setShipping({
        firstName: '', lastName: '', email: '',
        address: '', city: '', postalCode: ''
      });
    }
  };

  const handleSaveNewAddress = async () => {
    if (!user?.id) return;
    setIsSavingAddress(true);
    try {
      const newAddr: ShippingDetail = {
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        email: shipping.email,
        phone_number: 'N/A',
        delivery_address: shipping.address,
        city: shipping.city,
        postal: shipping.postalCode
      };
      await UserService.addShippingDetail(user.id, newAddr);
      const updatedList = [...savedAddresses, newAddr];
      setSavedAddresses(updatedList);
      setSelectedAddressIndex(updatedList.length - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const [payment, setPayment] = useState({
    useSaved: 'true', cardName: '', cardNumber: '', expiry: '', cvc: ''
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }
    
    // If Airwallex is already mounted, user is confirming via Airwallex
    if (awxDetails) {
      setIsSubmitting(true);
      try {
        // @ts-ignore
        const res = await window.Airwallex.confirmPaymentIntent({
          // @ts-ignore
          element: window.Airwallex.getElement('card'),
          id: awxDetails.intentId,
          client_secret: awxDetails.clientSecret,
        });
        
        if (res?.error) {
          console.error(res.error);
          setIsSubmitting(false);
          return;
        }

        await PaymentService.confirmPayment(awxDetails.checkoutId, awxDetails.intentId);
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
      } catch (err) {
        console.error('Airwallex confirmation failed', err);
        setIsSubmitting(false);
      }
      return;
    }

    // First time submitting final review
    setIsSubmitting(true);
    try {
      const checkoutId = `chk_${Date.now()}`;
      const cartId = `cart_${Date.now()}`;
      const userId = user?.id || 'guest';
      const paymentMethod = payment.useSaved === 'true' ? 'recurrent' : 'full';

      await PaymentService.createOrder(checkoutId, cartId, userId, paymentMethod, 1);
      const intentRes = await PaymentService.processPayment(checkoutId, total, userId);
      
      if (payment.useSaved === 'false' && intentRes.client_secret) {
        setAwxDetails({
          clientSecret: intentRes.client_secret,
          intentId: intentRes.payment_id as string,
          checkoutId,
        });
        setIsSubmitting(false);
      } else {
        // Successfully processed recurrently or via anomaly fallback
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
      }
    } catch (err) {
      console.error('Payment processing failed', err);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 3, textAlign: 'center' }}>
        <CheckCircleRounded sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h3" fontWeight="800" color="primary.main">
          Acquisition Successful
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, fontSize: '1.1rem' }}>
          Thank you for exploring Atelier Market. Your curated items are being prepared for complimentary white-glove delivery.
        </Typography>
        <Button variant="contained" color="secondary" size="large" sx={{ mt: 2, px: 4, py: 1.5 }} onClick={() => navigate('/')}>
          Return to Gallery
        </Button>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Typography variant="h5" color="text.secondary" gutterBottom>Your Curated Bag is empty.</Typography>
        <Button variant="outlined" color="primary" onClick={() => navigate('/')} sx={{ mt: 3, px: 4 }}>
          Discover Artifacts
        </Button>
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }} color="primary.main">
              Delivery Destination
            </Typography>
            
            {isLoadingAddresses ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : user && savedAddresses.length > 0 ? (
              <RadioGroup 
                value={selectedAddressIndex} 
                onChange={(e) => handleSelectAddress(Number(e.target.value))} 
                sx={{ mb: 3 }}
              >
                {savedAddresses.map((addr, idx) => (
                  <Card key={idx} variant="outlined" sx={{ mb: 2, p: 2, borderColor: selectedAddressIndex === idx ? 'primary.main' : 'rgba(54, 79, 107, 0.15)', bgcolor: selectedAddressIndex === idx ? 'rgba(54, 79, 107, 0.02)' : 'transparent' }}>
                    <FormControlLabel 
                      value={idx} 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography fontWeight={600}>{addr.first_name} {addr.last_name}</Typography>
                          <Typography variant="body2" color="text.secondary">{addr.delivery_address}, {addr.city}, {addr.postal}</Typography>
                        </Box>
                      } 
                    />
                  </Card>
                ))}
                
                <Card variant="outlined" sx={{ p: 2, borderColor: selectedAddressIndex === -1 ? 'primary.main' : 'rgba(54, 79, 107, 0.15)', bgcolor: selectedAddressIndex === -1 ? 'rgba(54, 79, 107, 0.02)' : 'transparent' }}>
                    <FormControlLabel value={-1} control={<Radio />} label={<Typography fontWeight={600}>Add a new address</Typography>} />
                </Card>
              </RadioGroup>
            ) : null}

            {(!user || savedAddresses.length === 0 || selectedAddressIndex === -1) && (
              <Box sx={{ mt: user && savedAddresses.length > 0 ? 2 : 0 }}>
                {user && savedAddresses.length > 0 && selectedAddressIndex === -1 && (
                   <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>New Address Details</Typography>
                )}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label="First Name" value={shipping.firstName} onChange={(e) => setShipping({...shipping, firstName: e.target.value})} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label="Last Name" value={shipping.lastName} onChange={(e) => setShipping({...shipping, lastName: e.target.value})} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField required fullWidth type="email" label="Email Address" value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField required fullWidth label="Delivery Address" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label="City" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label="Postal Code" value={shipping.postalCode} onChange={(e) => setShipping({...shipping, postalCode: e.target.value})} />
                  </Grid>
                </Grid>
                {user && selectedAddressIndex === -1 && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mt: 3 }} 
                    onClick={handleSaveNewAddress}
                    disabled={isSavingAddress || !shipping.firstName || !shipping.address}
                  >
                    {isSavingAddress ? 'Saving...' : 'Save & Use this Address'}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ mt: 1, mb: 3 }} color="primary.main">
              Payment Details
            </Typography>
            <Alert icon={<LockOutlined />} severity="success" sx={{ mb: 4, borderRadius: 2, bgcolor: 'rgba(63, 193, 201, 0.1)', color: 'secondary.dark', '& .MuiAlert-icon': { color: 'secondary.main'} }}>
              Payment is secured with 256-bit encryption.
            </Alert>
            <RadioGroup value={payment.useSaved} onChange={(e) => setPayment({...payment, useSaved: e.target.value})} sx={{ mb: 3 }}>
              <Card variant="outlined" sx={{ mb: 2, p: 2, borderColor: payment.useSaved === 'true' ? 'primary.main' : 'rgba(54, 79, 107, 0.15)', bgcolor: payment.useSaved === 'true' ? 'rgba(54, 79, 107, 0.02)' : 'transparent' }}>
                <FormControlLabel value="true" control={<Radio />} label={<Typography fontWeight={600}>Atelier Black Card ending in •••• 4242</Typography>} />
              </Card>
              <Card variant="outlined" sx={{ p: 2, borderColor: payment.useSaved === 'false' ? 'primary.main' : 'rgba(54, 79, 107, 0.15)', bgcolor: payment.useSaved === 'false' ? 'rgba(54, 79, 107, 0.02)' : 'transparent' }}>
                <FormControlLabel value="false" control={<Radio />} label={<Typography fontWeight={600}>Add a new credit or debit card</Typography>} />
                {payment.useSaved === 'false' && (
                  <Box sx={{ mt: 3, px: 1 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField required={payment.useSaved === 'false'} fullWidth label="Cardholder Name" value={payment.cardName} onChange={(e) => setPayment({...payment, cardName: e.target.value})} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField required={payment.useSaved === 'false'} fullWidth label="Card Number" placeholder="**** **** **** ****" value={payment.cardNumber} onChange={(e) => setPayment({...payment, cardNumber: e.target.value})} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField required={payment.useSaved === 'false'} fullWidth label="Expiry (MM/YY)" value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField required={payment.useSaved === 'false'} fullWidth label="CVC" value={payment.cvc} onChange={(e) => setPayment({...payment, cvc: e.target.value})} />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Card>
            </RadioGroup>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }} color="primary.main">
              Final Review
            </Typography>
            <Typography variant="body1" paragraph>
              Please verify your shipping and payment details before completing the acquisition.
            </Typography>
            
             <Card elevation={0} sx={{ p: 3, mb: 3, border: '1px solid rgba(54, 79, 107, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocalShippingOutlined color="primary" fontSize="small" />
                    <Typography fontWeight="700">Shipping To</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}<br />
                    {shipping.city}, {shipping.postalCode}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LockOutlined color="primary" fontSize="small" />
                    <Typography fontWeight="700">Payment</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {payment.useSaved === 'true' ? 'Atelier Black Card (•••• 4242)' : `${payment.cardName} (•••• ${payment.cardNumber.slice(-4)})`}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            {awxDetails && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }} color="primary.main">
                  Secure Checkout
                </Typography>
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <div id="airwallex-card-element" style={{ minHeight: '150px' }} />
                </Card>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackRounded />}
        onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
        sx={{ mb: 3, fontWeight: 700 }}
      >
        {activeStep === 0 ? 'Back to Bag' : 'Previous Step'}
      </Button>
      
      <Typography variant="h2" component="h1" fontWeight="800" gutterBottom color="primary.main">
        Checkout
      </Typography>

      <Box sx={{ my: 5 }}>
         <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
         </Stepper>
      </Box>

      <Grid container spacing={6}>
        {/* Form Area */}
        <Grid size={{ xs: 12, md: 7 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ minHeight: 320 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={isSubmitting}
                sx={{ py: 1.5, px: 6, fontSize: '1.05rem' }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? (awxDetails ? 'Confirm Payment' : 'Acquire Now') : 'Continue'}
              </Button>
            </Box>
          </form>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ p: 4, position: 'sticky', top: 100, border: '1px solid rgba(54, 79, 107, 0.08)' }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <ShoppingBagOutlined color="primary" />
              <Typography variant="h5" fontWeight="800" color="primary.main">
                Order Summary
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ maxHeight: 360, overflowY: 'auto', mb: 3, pr: 1 }}>
              {items.map((item) => (
                <Box key={item.product.id} display="flex" alignItems="center" mb={3} gap={2}>
                  <Box
                    component="img"
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2 }}
                  />
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3, mb: 0.5 }}>{item.product.name}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>Qty: {item.quantity}</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography color="text.secondary" fontWeight={500}>Subtotal</Typography>
              <Typography fontWeight={700}>${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography color="text.secondary" fontWeight={500}>Shipping</Typography>
              <Typography color="secondary.main" fontWeight={700}>Complimentary</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="800" color="primary.main">Total</Typography>
              <Typography variant="h4" fontWeight="800" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
