import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Conditional } from 'components/Conditional';
import Image from 'next/image';

export const ProposalForm = ({ proposal, address }) => {
  const [debugValue, setDebugValue] = useState();
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    nftName: Yup.string().required('NFT Name is required'),
    shortDescription: Yup.string().required('Short description is required'),
    description: Yup.string().required('Description is required'),
    royaltyFee: Yup.number()
      .required('Royalty Fee is required')
      .typeError('Royalty Fee must be a number')
      .max(10),
    contributors: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().email('Please set valid email').required('Email address is required'),
        wallet: Yup.string('Wlletms').required('Wallet address is required'),
        share: Yup.number()
          .required('Percentage is required')
          .typeError('Percentage must be a number'),
      })
    ),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: proposal,
    values: proposal,
  };

  const { register, handleSubmit, reset, formState, control, setValue } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    setDebugValue(JSON.stringify(proposal, null, 2));
  }, [
    address,
    setValue,
    proposal,
    reset,
    contributorsReplace,
  ]);

  const {
    fields: contributorsFields,
    append: contributorsAppend,
    remove: contributorsRemove,
    replace: contributorsReplace,
  } = useFieldArray({
    control,
    name: 'contributors',
  });

  const reqHandler = async (endpoint, method, body = null) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    };

    try {
      await fetch(endpoint, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then((jsonData) => {
          setDebugValue(JSON.stringify(jsonData, null, 2));
        });

      router.push('/');
    } catch (err) {
      throw Error(err);
    }
  };

  const onSave = async (data, e) => {
    e.preventDefault();

    const endpoint = '/api/proposal' + (proposal._id !== null ? '/' + proposal._id : '');

    try {
      await reqHandler(endpoint, 'POST', data);
      alert('proposal was saved successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const endpoint = `/api/proposal/${proposal._id}/submit`;

    try {
      await reqHandler(endpoint, 'POST', data);
      alert('proposal was successfully submitted');
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    const endpoint = `/api/proposal/${proposal._id}`;

    try {
      await reqHandler(endpoint, 'DELETE');
      alert('proposal was successfully deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const onMint = async () => {
    const endpoint = `/api/proposal/${proposal._id}/mint`;

    try {
      await reqHandler(endpoint, 'POST');
      alert('proposal was successfully mint');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form className="ui form" onSubmit={handleSubmit(onSave)} disabled={!address}>
        <section className="section section-imageproposal">
          <div className="container">
            <div className="container-tabs">
              <div className="tabsection">
                <h2 className="titletabs">Image Proposal</h2>
              </div>
              <div className="container-imageproposal">
                <div className="row">
                  <div className="col-md-6">
                    <div className="frame-uploadimage">
                      <div className="imgiconupload">
                        <Image
                          src="/img/icon-image.png"
                          width={10}
                          height={10}
                          style={{
                            width: '100%',
                            height: 'auto',
                          }}
                          alt="Picture of the author"
                        />
                      </div>
                      <div className="btn btn-primary btn-file">
                        Upload Image
                        <input type="file" name="file" />
                      </div>
                    </div>
                    <div className="notesupload">
                      <p>File jpg, jpeg, png, gif. Max size 2 MB</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-imagedesc">
                      <div className="mb-3">
                        <label className="form-label">Proposal ID</label>
                        <input
                          className="form-control"
                          name="_id"
                          type="text"
                          {...register('_id')}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <input
                          className="form-control"
                          name="status"
                          type="text"
                          {...register('status')}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">NFT Name</label>
                        <input
                          className={`form-control ${errors.nftName ? 'is-invalid' : ''}`}
                          name="nftName"
                          type="text"
                          {...register('nftName')}
                          readOnly={proposal.status === 1}
                        />
                        <div className="invalid-feedback">{errors.nftName?.message}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Short Description</label>
                        <input
                          className={`form-control ${errors.shortDescription ? 'is-invalid' : ''}`}
                          name="shortDescription"
                          type="text"
                          {...register('shortDescription')}
                          readOnly={proposal.status === 1}
                        />
                        <div className="invalid-feedback">{errors.shortDescription?.message}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          name="description"
                          rows="2"
                          {...register('description')}
                          readOnly={proposal.status === 1}
                        />
                        <div className="invalid-feedback">{errors.description?.message}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Creator Address</label>
                        <input
                          className={`form-control ${errors.creatorAddress ? 'is-invalid' : ''}`}
                          name="creatorAddress"
                          type="text"
                          {...register('creatorAddress')}
                          readOnly
                        />
                        <div className="invalid-feedback">{errors.creatorAddress?.message}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-imageproposal">
          <div className="container">
            <div className="container-tabs">
              <div className="tabsection">
                <h2 className="titletabs">Shares</h2>
              </div>
              <div className="container-imageproposal">
                {contributorsFields.map((item, index) => (
                  <div key={item.id} className="owner-n">
                    <div className="row">
                      <div className="col-lg-3 ownern-tab">
                        <h4 className="title-ownerntab">Owner {index + 1}</h4>
                      </div>
                    </div>
                    <div className="row rowowner">
                      <div className="col-md-4 col-field col-owner-email">
                        <div>
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className={`form-control ${
                              errors.contributors && errors.contributors[index]?.email
                                ? 'is-invalid'
                                : ''
                            }`}
                            {...register(`contributors.${index}.email`)}
                          />
                          <div className="invalid-feedback">
                            {errors.contributors && errors.contributors[index]?.email
                              ? errors.contributors[index].email.message
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-field col-owner-wallet">
                        <div>
                          <label className="form-label">Wallet Address</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.contributors && errors.contributors[index]?.wallet
                                ? 'is-invalid'
                                : ''
                            }`}
                            {...register(`contributors.${index}.wallet`)}
                          />
                          <div className="invalid-feedback">
                            {errors.contributors && errors.contributors[index]?.wallet
                              ? errors.contributors[index].wallet.message
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 col-field col-owner-percentshare">
                        <div>
                          <label className="form-label">% Share</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.contributors && errors.contributors[index]?.share
                                ? 'is-invalid'
                                : ''
                            }`}
                            {...register(`contributors.${index}.share`)}
                          />
                          <div className="invalid-feedback">
                            {errors.contributors && errors.contributors[index]?.share
                              ? errors.contributors[index].share.message
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1 col-field col-owner-status">
                        <div>
                          <label className="form-label">Status</label>
                          <Conditional visible={item.status === 1}>
                            <i className="fa-status fa fa-check fa-green" />
                          </Conditional>
                          <Conditional
                            visible={
                              item.status === 0 || item.status === undefined || item.status === null
                            }>
                            <i className="fa-status fa fa-close fa-red" />
                          </Conditional>
                        </div>
                      </div>
                      <div className="col-md-1 col-field col-owner-action">
                        <div>
                          <label className="form-label">&nbsp;</label>
                          <button
                            type="button"
                            className="btn btn-action"
                            onClick={() => contributorsRemove(index)}>
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="moreaction">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => contributorsAppend({ email: '', wallet: '', share: 0 })}>
                    <i className="fa fa-plus" /> Add contributors
                  </button>
                </div>
                <div className="othershare">
                  <div className="row row-othershare">
                    <div className="col-md-8">Platform Fee</div>
                    <div className="col-md-4">10 %</div>
                  </div>
                  <div className="row row-othershare">
                    <div className="col-md-8">
                      <strong>Total Shares %</strong>
                    </div>
                    <div className="col-md-4">
                      <strong className="fa-green">100 %</strong>
                      {/*<strong className="fa-red">75 %</strong>*/}
                    </div>
                  </div>
                  <div className="row rowowner">
                    <div className="col-md-8">
                      <label className="labelspc">
                        <strong>ROYALTY</strong>
                        <button
                          type="button"
                          className="btntooltip"
                          data-bs-toggle="tooltip"
                          data-bs-html="true"
                          title="Royalty adalah persentase share yang didapat ketika image dijual ke pihak lain">
                          ?
                        </button>
                      </label>
                    </div>
                    <div className="col-md-2">
                      <div>
                        <label className="form-label">% Royalty</label>
                        <input
                          type="number"
                          className={`form-control ${errors.royaltyFee ? 'is-invalid' : ''}`}
                          {...register('royaltyFee')}
                        />
                        <div className="invalid-feedback">{errors.royaltyFee?.message}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section-action">
          <div className="container d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary btn-gradientone btn-lg"
              onClick={() => reset()}>
              Reset
            </button>
            <Conditional visible={proposal.creatorAddress === address && proposal.status === 0}>
              <button type="submit" className="btn btn-primary btn-gradientone btn-lg">
                Save
              </button>
            </Conditional>
            <Conditional
              visible={proposal.contributors.find(
                (el) => el.wallet === address && el.status === 0
              )}>
              <button
                type="button"
                className="btn btn-primary btn-gradientone btn-lg"
                onClick={handleSubmit(onSubmit)}>
                Submit
              </button>
            </Conditional>
            <Conditional visible={false}>
              <button
                type="button"
                className="btn btn-primary btn-gradientone btn-lg"
                onClick={() => onDelete(proposal._id)}>
                Delete
              </button>
            </Conditional>
            <Conditional visible={proposal.status === 2}>
              <button
                type="button"
                className="btn btn-primary btn-gradientone btn-lg"
                onClick={() => onMint()}>
                MINT
              </button>
            </Conditional>
          </div>
        </section>
        <section className="section section-imageproposal">
          <div className="container">
            <div className="container-tabs">
              <div className="tabsection">
                <h2 className="titletabs">Debug</h2>
              </div>
              <div className="container-imageproposal">
                <div className="row">
                  <textarea value={debugValue} type="text" disabled />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default ProposalForm;
