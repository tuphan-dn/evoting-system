use anchor_lang::prelude::*;

#[account]
pub struct Candidate {
  pub mint: Pubkey,
  pub amount: u64,
  pub start_date: i64,
  pub end_date: i64,
}

impl Candidate {
  pub const SIZE: usize = 8 + 32 + 8 + 8 + 8;
}
