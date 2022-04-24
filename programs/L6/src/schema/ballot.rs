use anchor_lang::prelude::*;

#[account]
pub struct Ballot {
  pub authority: Pubkey,
  pub candidate: Pubkey,
  pub amount: u64,
}

impl Ballot {
  pub const SIZE: usize = 8 + 32 + 32 + 8;
}
